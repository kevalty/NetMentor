import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Alert from './Alert';
import HeaderLog from './HeaderLog';
import Sidebar from './Sidebar21';
import './TestPage.css';
import API_BASE_URL from '../config'; // Importa la URL base desde config.js

const TestPage = () => {
  const [userData, setUserData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeLimit, setTimeLimit] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [testAlreadyTaken, setTestAlreadyTaken] = useState(false);
  const [highestGrade, setHighestGrade] = useState(null);
  const [contentName, setContentName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const { testId, contentId } = useParams();

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
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

            // Check if the user has already taken this test
            const takenTestsResponse = await fetch(`${API_BASE_URL}taken-tests?populate=*`, {
              headers: {
                Authorization: `Bearer ${jwt}`
              }
            });
            const takenTestsData = await takenTestsResponse.json();
            const userTakenTests = takenTestsData.data.filter(test => test.attributes.user.data.id === data.id);

            const hasTakenTest = userTakenTests.some(test => test.attributes.tests.data.some(t => t.id === parseInt(testId)));

            if (hasTakenTest) {
              setTestAlreadyTaken(true);

              // Get the highest grade for this test
              const resultsResponse = await fetch(`${API_BASE_URL}results?filters[users_permissions_user][id][$eq]=${data.id}&filters[tests][id][$eq]=${testId}`, {
                headers: {
                  Authorization: `Bearer ${jwt}`
                }
              });
              const resultsData = await resultsResponse.json();
              if (resultsData.data.length > 0) {
                const maxGrade = Math.max(...resultsData.data.map(result => result.attributes.grades));
                setHighestGrade(maxGrade);
              }
            } else {
              setTestAlreadyTaken(false);
            }
          } else {
            console.error('Error al obtener los datos del usuario');
          }
        } catch (error) {
          console.error('Error de red al obtener los datos del usuario:', error);
        }
      }
    };

    fetchUserData();
  }, [testId]);

  useEffect(() => {
    const fetchTestInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}tests/${testId}?populate[questions][populate]=*`);
        if (response.ok) {
          const { data } = await response.json();
          const selectedTest = data;
          const testQuestions = selectedTest?.attributes.questions?.data || [];
          setQuestions(testQuestions);
          setAnswers(new Array(testQuestions.length).fill(null).map(() => []));
          const testTimeLimit = selectedTest?.attributes.time || 0;
          const timeInSeconds = testTimeLimit * 60;
          setTimeLimit(timeInSeconds);
          setRemainingTime(timeInSeconds);

          // Fetch the content name
          const contentResponse = await fetch(`${API_BASE_URL}contents/${contentId}`);
          if (contentResponse.ok) {
            const contentData = await contentResponse.json();
            setContentName(contentData.data.attributes.name);
          } else {
            console.error('Error al obtener el nombre del contenido');
          }
        } else {
          console.error('Error al obtener la información del test');
        }
      } catch (error) {
        console.error('Error de red al obtener la información del test:', error);
      }
    };

    if (!testAlreadyTaken) {
      fetchTestInfo();
    }
  }, [testId, testAlreadyTaken]);

  useEffect(() => {
    if (remainingTime > 0) {
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
  }, [remainingTime]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    const handlePopState = (event) => {
      setAlertOpen(true);
      window.history.pushState(null, null, window.location.pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.history.pushState(null, null, window.location.pathname);
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
      const correctIndexes = questions[index].attributes.correct_indexes || [];
      if (correctIndexes.length === 0) {
        return acc;
      }

      if (questions[index].attributes.type === 'drag-and-drop') {
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
          name: `Prueba de ${contentName}`,
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
        } else {
          console.error('Error al guardar el resultado');
        }
      } catch (error) {
        console.error('Error de red al guardar el resultado o actualizar el taken-test:', error);
      }
    } else {
      console.error('Datos del usuario no disponibles');
    }

    navigate('/resultado', { state: { score: roundedScore, questions, answers, examId: testId } });
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const renderQuestionContent = (question, index) => {
    switch (question.attributes.type) {
      case 'single-choice':
        return (
          <ul className="final-choices-list">
            {Object.keys(question.attributes.choices).map((choiceKey, choiceIndex) => (
              <li key={choiceIndex} className="final-choice-item">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={choiceIndex}
                  checked={answers[index]?.includes(choiceIndex)}
                  onChange={() => handleAnswerChange(index, choiceIndex, false)}
                  className="final-choice-radio"
                />
                {question.attributes.choices[choiceKey]}
              </li>
            ))}
          </ul>
        );
      case 'multiple-choice':
        return (
          <ul className="final-choices-list">
            {Object.keys(question.attributes.choices).map((choiceKey, choiceIndex) => (
              <li key={choiceIndex} className="final-choice-item">
                <input
                  type="checkbox"
                  name={`question-${index}`}
                  value={choiceIndex}
                  checked={answers[index]?.includes(choiceIndex)}
                  onChange={() => handleAnswerChange(index, choiceIndex, true)}
                  className="final-choice-checkbox"
                />
                {question.attributes.choices[choiceKey]}
              </li>
            ))}
          </ul>
        );
      case 'drag-and-drop':
        return (
          <div className="final-drag-and-drop-container">
            <div className="final-drag-drop-sentence">
              {question.attributes.drag_options.map((option, idx) => (
                <React.Fragment key={idx}>
                  {option.text_initial && <span>{option.text_initial} </span>}
                  <span 
                    className="final-drag-placeholder"
                    onDrop={(e) => handleDrop(e, index, idx)}
                    onDragOver={allowDrop}
                  >
                    {answers[index][idx] || '______'}
                  </span>
                  <span> {option.text_final} </span>
                </React.Fragment>
              ))}
            </div>
            <div className="final-drag-options">
              {question.attributes.drag_options.map((option, idx) => (
                <div
                  key={idx}
                  draggable
                  onDragStart={(e) => handleDragStart(e, option)}
                  className="final-drag-option"
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

  if (testAlreadyTaken) {
    return (
      <div className="final-page">
        <HeaderLog userData={userData} />
        <Sidebar isOpen={isSidebarOpen} handleToggle={handleSidebarToggle} />
        <div className="final-content1">
          <div className="exam-info final-exam-info">
            <h1 className="exam-title final-exam-title">Prueba de {contentName}</h1>
            <p className="exam-info-text final-exam-info-text">Ya has realizado esta prueba.</p>
            {highestGrade !== null && (
              <p className="exam-length-text final-exam-length-text">Tu calificación más alta fue: {highestGrade}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="final-page">
      <div className="final-content1">
        <div className="exam-info final-exam-info">
          <h1 className="exam-title final-exam-title">Prueba de {contentName}</h1>
          <p className="exam-info-text final-exam-info-text">Prueba Final de contenidos</p>
          <p className="exam-length-text final-exam-length-text">La prueba estará evaluada sobre {questions.length}</p>
        </div>
        <div className="question-section final-question-section">
          <p className="question-instructions final-question-instructions">Por favor, seleccione una respuesta para cada pregunta:</p>
          <div className="questions final-questions">
            {questions.length > 0 ? (
              questions.map((question, index) => (
                <div key={index} className="question-box final-question-box">
                  <div className="question-content final-question-content">
                    <p className="question-name final-question-name"><strong>{question.attributes.name}</strong></p>
                    {renderQuestionContent(question, index)}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-questions-text final-no-questions-text">No hay preguntas disponibles.</p>
            )}
          </div>
          {questions.length > 0 && (
            <div className="finish-exam-button-container">
              <button className="contenido-clase-button2" onClick={handleEndExam}>Terminar Examen</button>
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
    </div>
  );
};

export default TestPage;
