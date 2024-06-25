import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Alert from './Alert';
import HeaderLog from './HeaderLog';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './SharedStyles.css'; // Importar el nuevo CSS compartido

const TestPage = () => {
  const [userData, setUserData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [timeLimit, setTimeLimit] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [testActive, setTestActive] = useState(true);
  const [highestGrade, setHighestGrade] = useState(null);
  const [contentName, setContentName] = useState('');
  const [alertOpen, setAlertOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { contentId, testId } = useParams();
  const navigate = useNavigate();
  const intervalRef = useRef(null);

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
          const response = await fetch('http://localhost:1337/api/users/me?populate=*', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserData(data);

            const results = data.results;
            const relevantResults = results.filter(result => result.name.includes('Prueba de'));
            if (relevantResults.length > 0) {
              const maxGrade = Math.max(...relevantResults.map(result => result.grades));
              setHighestGrade(maxGrade);
            }
          } else {
            console.error('Error al obtener los datos del usuario');
          }
        } catch (error) {
          console.error('Error de red al obtener los datos del usuario:', error);
        }
      }
    };

    const fetchContentName = async () => {
      const jwt = localStorage.getItem('jwt');
      if (jwt) {
        try {
          const response = await fetch(`http://localhost:1337/api/contents/${contentId}`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          if (response.ok) {
            const contentData = await response.json();
            setContentName(contentData.data.attributes.name);
          } else {
            console.error('Error al obtener el nombre del contenido');
          }
        } catch (error) {
          console.error('Error de red al obtener el nombre del contenido:', error);
        }
      }
    };

    fetchUserData();
    fetchContentName();
  }, [contentId]);

  useEffect(() => {
    const fetchTestInfo = async () => {
      try {
        const response = await fetch(`http://localhost:1337/api/tests/${testId}?populate=*`);
        if (response.ok) {
          const { data } = await response.json();
          const selectedTest = data;
          if (selectedTest) {
            const testQuestions = selectedTest.attributes.questions?.data || [];
            setQuestions(testQuestions);
            setAnswers(new Array(testQuestions.length).fill(null).map(() => []));
            const testTimeLimit = selectedTest.attributes.time || 0;
            const timeInSeconds = testTimeLimit * 60;
            setTimeLimit(timeInSeconds);
            setRemainingTime(timeInSeconds);
            setStartTime(Date.now());
            setTestActive(selectedTest.attributes.active);
          } else {
            console.error('Test no encontrado');
          }
        } else {
          console.error('Error al obtener la información del test');
        }
      } catch (error) {
        console.error('Error de red al obtener la información del test:', error);
      }
    };

    fetchTestInfo();
  }, [testId]);

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

    if (userData) {
      const jwt = localStorage.getItem('jwt');

      try {
        const contentResponse = await fetch(`http://localhost:1337/api/contents/${contentId}`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!contentResponse.ok) {
          throw new Error('Error al obtener el nombre del contenido');
        }

        const contentData = await contentResponse.json();
        const contentName = contentData.data.attributes.name;

        const resultData = {
          data: {
            name: `Prueba de '${contentName}'`,
            grades: score,
            users_permissions_user: userData.id
          }
        };

        const responseResult = await fetch('http://localhost:1337/api/results', {
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

        const contentUpdateResponse = await fetch(`http://localhost:1337/api/contents/${contentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
          },
          body: JSON.stringify({ data: { comprobado: true } })
        });

        if (contentUpdateResponse.ok) {
          const contentUpdateResult = await contentUpdateResponse.json();
          console.log('Contenido actualizado:', contentUpdateResult);
        } else {
          console.error('Error al actualizar el contenido');
        }

        const testUpdateResponse = await fetch(`http://localhost:1337/api/tests/${testId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`
          },
          body: JSON.stringify({ data: { active: false } })
        });

        if (testUpdateResponse.ok) {
          const testUpdateResult = await testUpdateResponse.json();
          console.log('Test actualizado:', testUpdateResult);
        } else {
          console.error('Error al actualizar el test');
        }

      } catch (error) {
        console.error('Error de red al guardar el resultado o actualizar el estado del test:', error);
      }
    } else {
      console.error('Datos del usuario no disponibles');
    }

    navigate('/resultado', { state: { score, questions, answers } });
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
          <ul className="diagnostico-choices-list">
            {Object.keys(question.attributes.choices).map((choiceKey, choiceIndex) => (
              <li key={choiceIndex} className="diagnostico-choice-item">
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={choiceIndex}
                  checked={answers[index]?.includes(choiceIndex)}
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

  if (!testActive) {
    return (
      <div className="diagnostico1-page1">
        <HeaderLog userData={userData} />
        <div className={`diagnostico-page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <Sidebar isOpen={isSidebarOpen} handleToggle={handleSidebarToggle} />
          <div className="diagnostico1-content1 diagnostico-result">
            <p className="diagnostico-result-text">Prueba de '{contentName}' realizada con éxito, su nota es: {highestGrade}.</p>
            <p className="diagnostico-congratulations-text">¡Felicitaciones por completar la prueba final!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="diagnostico-page" onClick={() => setAlertOpen(true)}>
      <div className={`diagnostico-page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="diagnostico2-content2">
          <div className="diagnostico-exam-info">
            <h1 className="diagnostico-exam-title">Examen Final</h1>
            <p className="diagnostico-exam-info-text">Prueba Final de contenidos</p>
            <p className="diagnostico-exam-length-text">La prueba estará evaluada sobre {questions.length}</p>
          </div>
          <div className="diagnostico-question-section">
            <p className="diagnostico-question-instructions">Por favor, seleccione una respuesta para cada pregunta:</p>
            <div className="diagnostico-questions">
              {questions.length > 0 ? (
                questions.map((question, index) => (
                  <div key={index} className="diagnostico-question-box">
                    <div className="diagnostico-question-content">
                      <p className="diagnostico-question-name"><strong>{question.attributes.name}</strong></p>
                      {renderQuestionContent(question, index)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="diagnostico-no-questions-text">No hay preguntas disponibles.</p>
              )}
            </div>
            {questions.length > 0 && (
              <div className="finish-exam-button-container">
                <button className="diagnostico-finish-exam-button" onClick={handleEndExam}>Terminar Examen</button>
              </div>
            )}
          </div>
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
