import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import AdminNavigationBar from './AdminNavigationBar';
import editarIcon from '../../assets/editar.png';
import eliminarIcon from '../../assets/eliminar.png';
import crearIcon from '../../assets/crear.png';
import AddQuestionModal from './AddQuestionModal';
import EditQuestionModal from './EditQuestionModal';
import AlertModal from '../Alert2.js';
import './PreguntasCruds.css';
import API_BASE_URL from '../../config'; // Importa la URL base desde config.js

function TestDetailsPage() {
  const [questions, setQuestions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const testId = window.location.pathname.split('/').pop();
        const response = await fetch(`${API_BASE_URL}tests/${testId}?populate=*`);
        const data = await response.json();
        const questionsData = data.data.attributes.questions.data || [];
        
        const sortedQuestions = questionsData.sort((a, b) => a.id - b.id);
        setQuestions(sortedQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
  
    fetchQuestions();
  }, []);

  const handleAddQuestion = (newQuestionData) => {
    const testId = window.location.pathname.split('/').pop(); 
    newQuestionData.test = parseInt(testId); 
    fetch(`${API_BASE_URL}questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: newQuestionData })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Nueva pregunta añadida:', data);
        setQuestions(prevQuestions => [...prevQuestions, data.data]);
        setShowAddModal(false);
        setAlertMessage('Pregunta agregada con éxito');
        setAlertOpen(true);
      })
      .catch(error => {
        console.error('Error al agregar la pregunta:', error);
      });
  };

  const handleEditQuestion = (editedQuestionData) => {
    const questionId = selectedQuestion.id;
  
    fetch(`${API_BASE_URL}questions/${questionId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: editedQuestionData })
    })
      .then(response => response.json())
      .then(data => {
        console.log('Pregunta editada:', data);
        setShowEditModal(false);
        setAlertMessage('Pregunta editada con éxito');
        setAlertOpen(true);
        const updatedQuestions = questions.map(question => {
          if (question.id === questionId) {
            return { ...question, ...data.data };
          }
          return question;
        });
        setQuestions(updatedQuestions);
      })
      .catch(error => {
        console.error('Error al editar la pregunta:', error);
      });
  };

  const handleDeleteQuestion = (questionId) => {
    fetch(`${API_BASE_URL}questions/${questionId}`, {
      method: 'DELETE'
    })
      .then(response => response.json())
      .then(() => {
        console.log('Pregunta eliminada:', questionId);
        const updatedQuestions = questions.filter(question => question.id !== questionId);
        setQuestions(updatedQuestions);
        setAlertMessage('Pregunta eliminada con éxito');
        setAlertOpen(true);
      })
      .catch(error => {
        console.error('Error al eliminar la pregunta:', error);
      });
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
    window.location.reload();
  };

  const handleEditClick = (question) => {
    setSelectedQuestion(question);
    setShowEditModal(true);
  };

  const renderDragAndDropQuestion = (dragOptions) => {
    return (
      <p>
        {dragOptions.map((option, index) => (
          <React.Fragment key={option.id}>
            {option.text_initial && <span>{option.text_initial} </span>}
            <span style={{ textDecoration: 'underline', color: 'blue' }}>{option.option}</span>
            <span> {option.text_final} </span>
          </React.Fragment>
        ))}
      </p>
    );
  };

  const renderChoicesWithCorrectAnswer = (choices, correctIndexes) => {
    correctIndexes = correctIndexes || [];
    return (
      <ul>
        {Object.entries(choices).map(([key, value], index) => (
          <li key={key} style={{ color: correctIndexes.includes(index) ? 'green' : 'black' }}>
            {key}) {value}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <AdminHeader />
      <AdminNavigationBar />
      <div className="admin-content">
        <div className="admin-content__container">
          <h2 className="admin-content__title">Preguntas</h2>
          <div className="add-question">
            <img src={crearIcon} alt="Agregar pregunta" className="add-icon" onClick={() => setShowAddModal(true)} />
            <span className="add-title">Añadir Pregunta</span>
          </div>
          <div className="admin-content__inner">
            <div className="questions-container">
              {questions.map((question, index) => {
                const attributes = question.attributes || {};
                return (
                  <div className="question-card" key={index}>
                    <p>Pregunta: {attributes.name}</p>
                    <p>Tipo: {attributes.type}</p>
                    <p>Respuestas:</p>
                    {attributes.type === 'single-choice' || attributes.type === 'multiple-choice' ? (
                      renderChoicesWithCorrectAnswer(attributes.choices, attributes.correct_indexes)
                    ) : attributes.type === 'drag-and-drop' ? (
                      renderDragAndDropQuestion(attributes.drag_options)
                    ) : null}
                    <p>Explicación: {attributes.explication}</p>
                    <div className="question-actions">
                      <img src={editarIcon} alt="Editar" className="edit-icon" onClick={() => handleEditClick(question)} />
                      <img src={eliminarIcon} alt="Eliminar" className="delete-icon" onClick={() => handleDeleteQuestion(question.id)} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      {showAddModal && <AddQuestionModal showModal={showAddModal} onCloseModal={() => setShowAddModal(false)} onSubmit={handleAddQuestion} />}
      {showEditModal && <EditQuestionModal showModal={showEditModal} onCloseModal={() => setShowEditModal(false)} onSubmit={handleEditQuestion} question={selectedQuestion} />}
      <AlertModal open={alertOpen} handleClose={handleCloseAlert} message={alertMessage} />
    </div>
  );
}

export default TestDetailsPage;
