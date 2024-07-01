import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Alert from './Alert';
import './PruebaDiagnosticoPage.css';
import API_BASE_URL from '../config'; // Importa la URL base desde config.js

const DiagnosticoPage = () => {
  const [userData, setUserData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [remainingTime, setRemainingTime] = useState(0);
  const [testActive, setTestActive] = useState(true);
  const [alertOpen, setAlertOpen] = useState(false);
  const [isEndExamModalOpen, setIsEndExamModalOpen] = useState(false); // Estado para el modal de finalización del examen
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const testId = 2; // ID del test de diagnóstico

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const jwt = localStorage.getItem('jwt');
      if (jwt) {
        try {
          const response = await fetch(`${API_BASE_URL}users/me?populate=*`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          } else {
            console.error('Error al obtener los datos del usuario');
            navigate('/');
          }
        } catch (error) {
          console.error('Error de red al obtener los datos del usuario:', error);
          navigate('/');
        }
      } else {
        navigate('/');
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}tests/${testId}?populate=*`);
        if (response.ok) {
          const { data } = await response.json();
          const diagnosticTest = data;
          if (diagnosticTest) {
            const testQuestions = diagnosticTest.attributes.questions?.data || [];
            setQuestions(testQuestions);
            setAnswers(new Array(testQuestions.length).fill(null).map(() => []));
            const testTimeLimit = diagnosticTest.attributes.time || 0; // Obtener el límite de tiempo del examen desde el backend
            setStartTime(Date.now()); // Establecer la hora de inicio del examen
            setRemainingTime(testTimeLimit * 60); // Convertir el límite de tiempo a segundos
            setTestActive(diagnosticTest.attributes.active);
          } else {
            console.error('No se encontró el test de diagnóstico.');
          }
        } else {
          console.error('Error al obtener las preguntas');
        }
      } catch (error) {
        console.error('Error de red al obtener las preguntas:', error);
      }
    };

    fetchQuestions();
  }, []);

  useEffect(() => {
    if (startTime) {
      intervalRef.current = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current);
            handleEndExam();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      return () => clearInterval(intervalRef.current);
    }
  }, [startTime]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '¿Estás seguro de que quieres salir? Perderás tu progreso.';
    };

    const handlePopState = (event) => {
      setAlertOpen(true);
      window.history.pushState(null, null, window.location.href);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.history.pushState(null, null, window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleAnswerChange = (index, selectedChoice, isMultipleChoice) => {
    const newAnswers = [...answers];
    if (isMultipleChoice) {
      const choiceIndex = newAnswers[index].indexOf(selectedChoice);
      if (choiceIndex > -1) {
        newAnswers[index].splice(choiceIndex, 1);
      } else {
        newAnswers[index].push(selectedChoice);
      }
    } else {
      newAnswers[index] = [selectedChoice];
    }
    setAnswers(newAnswers);
  };

  const handleDragStart = (e, option) => {
    e.dataTransfer.setData('text/plain', option.option);
  };

  const handleDrop = (e, index, idx) => {
    const droppedOption = e.dataTransfer.getData('text/plain');
    const newAnswers = [...answers];
    newAnswers[index][idx] = droppedOption;
    setAnswers(newAnswers);
  };

  const allowDrop = (e) => {
    e.preventDefault();
  };

  const handleEndExam = async () => {
    const score = answers.reduce((acc, answer, index) => {
      const correctIndexes = questions[index]?.attributes.correct_indexes || [];
      if (correctIndexes.length === 0) {
        return acc;
      }

      if (questions[index]?.attributes.type === 'drag-and-drop') {
        const totalCorrect = correctIndexes.filter((correctIndex, i) => correctIndex === answer[i]).length;
        return acc + totalCorrect / correctIndexes.length;
      } else {
        const totalCorrect = answer.filter(a => correctIndexes.includes(a)).length;
        return acc + totalCorrect / correctIndexes.length;
      }
    }, 0);

    const roundedScore = Math.round(score); // Redondear el puntaje

    if (userData) {
      const resultData = {
        data: {
          name: 'Prueba Diagnostica',
          grades: roundedScore,
          users_permissions_user: userData.id
        }
      };

      try {
        const jwt = localStorage.getItem('jwt');
        const responseResult = await fetch(`${API_BASE_URL}results`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
          },
          body: JSON.stringify(resultData)
        });

        if (responseResult.ok) {
          const result = await responseResult.json();
          console.log('Resultado guardado:', result);
        } else {
          console.error('Error al guardar el resultado');
        }

        const takenTests = userData.taken_tests || [];
        let takenTestId = null;

        if (takenTests.length > 0) {
          takenTestId = takenTests[0].id;
          const takenTestResponse = await fetch(`${API_BASE_URL}taken-tests/${takenTestId}?populate=*`, {
            headers: {
              Authorization: `Bearer ${jwt}`
            }
          });
          const takenTestData = await takenTestResponse.json();
          const existingTestIds = takenTestData.data.attributes.tests.data.map(test => test.id);

          if (!existingTestIds.includes(parseInt(testId))) {
            existingTestIds.push(parseInt(testId));
          }

          const updateData = {
            data: {
              user: userData.id,
              tests: existingTestIds
            }
          };

          const updateResponse = await fetch(`${API_BASE_URL}taken-tests/${takenTestId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify(updateData)
          });

          if (updateResponse.ok) {
            console.log('Taken-test actualizado');
          } else {
            console.error('Error al actualizar el taken-test:', await updateResponse.text());
          }
        } else {
          const createData = {
            data: {
              user: userData.id,
              tests: [parseInt(testId)]
            }
          };

          const createResponse = await fetch(`${API_BASE_URL}taken-tests`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify(createData)
          });

          if (createResponse.ok) {
            console.log('Taken-test creado');
          } else {
            console.error('Error al crear el taken-test:', await createResponse.text());
          }
        }
      } catch (error) {
        console.error('Error de red al guardar el resultado o actualizar el taken-test:', error);
      }
    } else {
      console.error('Datos del usuario no disponibles');
    }

    navigate('/resultado', { state: { score: roundedScore, questions, answers } });
  };

  const handleOpenEndExamModal = () => {
    setIsEndExamModalOpen(true);
  };

  const handleCloseEndExamModal = () => {
    setIsEndExamModalOpen(false);
  };

  const handleConfirmEndExam = () => {
    setIsEndExamModalOpen(false);
    handleEndExam();
  };

  if (!testActive) {
    return <div>El examen está desactivado.</div>;
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestionContent = (question, index) => {
    switch (question.attributes.type) {
      case 'single-choice':
        return (
          <ul className="diagnostico-choices-list">
            {Object.keys(question.attributes.choices).map((choiceKey, choiceIndex) => (
              <li key={choiceIndex} className="diagnostico-choice-item">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={choiceIndex}
                  checked={answers[index]?.[0] === choiceIndex}
                  onChange={() => handleAnswerChange(index, choiceIndex, false)}
                  className="diagnostico-choice-radio"
                />
                {question.attributes.choices[choiceKey]}
              </li>
            ))}
          </ul>
        );
      case 'multiple-choice':
        return (
          <ul className="diagnostico-choices-list">
            {Object.keys(question.attributes.choices).map((choiceKey, choiceIndex) => (
              <li key={choiceIndex} className="diagnostico-choice-item">
                <input
                  type="checkbox"
                  name={`question-${index}`}
                  value={choiceIndex}
                  checked={answers[index]?.includes(choiceIndex)}
                  onChange={() => handleAnswerChange(index, choiceIndex, true)}
                  className="diagnostico-choice-checkbox"
                />
                {question.attributes.choices[choiceKey]}
              </li>
            ))}
          </ul>
        );
      case 'drag-and-drop':
        return (
          <div className="diagnostico-drag-and-drop-container">
            <div className="diagnostico-drag-drop-sentence">
              {question.attributes.drag_options.map((option, idx) => (
                <React.Fragment key={idx}>
                  {option.text_initial && <span>{option.text_initial} </span>}
                  <span 
                    className="diagnostico-drag-placeholder"
                    onDrop={(e) => handleDrop(e, index, idx)}
                    onDragOver={allowDrop}
                  >
                    {answers[index][idx] || '______'}
                  </span>
                  <span> {option.text_final} </span>
                </React.Fragment>
              ))}
            </div>
            <div className="diagnostico-drag-options">
              {question.attributes.drag_options.map((option, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => handleDragStart(e, option)}
                  className="diagnostico-drag-option"
                >
                  {option.option}
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="diagnostico-page">
      <div className="diagnostico-content">
        <div className="exam-info diagnostico-exam-info">
          <h1 className="exam-title diagnostico-exam-title">Prueba diagnóstica</h1>
          <p className="exam-info-text diagnostico-exam-info-text">Prueba de diagnóstico</p>
          <p className="exam-length-text diagnostico-exam-length-text">La prueba estará evaluada sobre {questions.length}</p>
        </div>
        <div className="question-section diagnostico-question-section">
          <p className="question-instructions diagnostico-question-instructions">Por favor, seleccione una respuesta para cada pregunta:</p>
          <div className="questions diagnostico-questions">
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <div key={index} className="question-box diagnostico-question-box">
                  <div className="question-content diagnostico-question-content">
                    <p className="question-name diagnostico-question-name"><strong>{question.attributes.name}</strong></p>
                    {renderQuestionContent(question, index)}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-questions-text diagnostico-no-questions-text">No hay preguntas disponibles.</p>
            )}
          </div>
          {questions.length > 0 && (
            <div className="finish-exam-button-container">
              <button className="finish-exam-button diagnostico-finish-exam-button" onClick={handleOpenEndExamModal}>Terminar Examen</button>
            </div>
          )}
        </div>
      </div>
      <div className="time-modal-container">
        <div className="time-modal-content">
          <p className="time-modal-text">Tiempo restante: {formatTime(remainingTime)}</p>
        </div>
      </div>
      <Alert open={alertOpen} handleClose={handleAlertClose} severity="warning" message="No se puede mover de esta página" />
      {isEndExamModalOpen && (
        <div className="end-exam-modal">
          <div className="end-exam-modal-content">
            <h2>¿Estás seguro de terminar el examen?</h2>
            <p>Puedes verificar tus respuestas antes de finalizar.</p>
            <button onClick={handleConfirmEndExam}>Aceptar</button>
            <button onClick={handleCloseEndExamModal}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticoPage;
