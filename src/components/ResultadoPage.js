import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './HeaderLog';
import Sidebar from './Sidebar';
import './ResultadoPage.css';
import API_BASE_URL from '../config';
import jsPDF from 'jspdf';

const ResultadoPage = () => {
  const location = useLocation();
  const { score, questions, answers, examId } = location.state || {};
  const [userData, setUserData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEligibleForCertificate, setIsEligibleForCertificate] = useState(false);

  useEffect(() => {
    const numericScore = Number(score);
    const numericExamId = Number(examId);
    if (numericExamId === 1 && numericScore > 7) {
      setIsEligibleForCertificate(true);
    } else {
      setIsEligibleForCertificate(false);
    }
  }, [score, examId]);

  useEffect(() => {
    const fetchUserData = async () => {
      const jwt = localStorage.getItem('jwt');
      if (jwt) {
        try {
          const response = await fetch(`${API_BASE_URL}users/me`, {
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
          }
        } catch (error) {
          console.error('Error de red al obtener los datos del usuario:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const generateCertificate = () => {
    if (userData && userData.name && userData.lastname) {
      const doc = new jsPDF('landscape');
      
      // Agregar fondo (reemplaza 'logoUrl' con la URL de tu imagen de fondo)
      const logoUrl = 'https://i.imgur.com/RvbZnq2.png'; // URL de tu imagen de fondo
      doc.addImage(logoUrl, 'PNG', 0, 0, 297, 210);

      // Agregar nombre del usuario en el lugar adecuado
      doc.setFontSize(36);
      doc.setTextColor(50, 50, 50); // Color negro plomo
      doc.text(`${userData.name.toUpperCase()} ${userData.lastname.toUpperCase()}`, 148.5, 135, { align: 'center' });

      doc.save('certificado.pdf');
    } else {
      console.error('User data or user name is not available.');
    }
  };

  if (!score && !questions && !answers) {
    return <p>Cargando...</p>;
  }

  const renderCorrectAnswer = (question) => {
    const { type, correct_indexes, drag_options } = question.attributes;
    if (type === 'single-choice' || type === 'multiple-choice') {
      return correct_indexes.map((index, i) => (
        <React.Fragment key={i}>
          {i > 0 && ', '}
          <span className="bold-correct-answer">
            {question.attributes.choices[Object.keys(question.attributes.choices)[index]]}
          </span>
        </React.Fragment>
      ));
    }
    if (type === 'drag-and-drop') {
      return drag_options.map((option, idx) => {
        const textInitial = option.text_initial ? option.text_initial + ' ' : '';
        const optionText = option.option ? (
          <span key={idx} className="bold-correct-answer">{option.option + ' '}</span>
        ) : '______ ';
        const textFinal = option.text_final ? option.text_final + ' ' : '';
        return (
          <React.Fragment key={idx}>
            {textInitial}{optionText}{textFinal}
          </React.Fragment>
        );
      });
    }
    return '';
  };

  const renderUserAnswer = (question, answer) => {
    const { type, choices, drag_options } = question.attributes;
    if (type === 'single-choice' || type === 'multiple-choice') {
      return answer.map((a, i) => (
        <React.Fragment key={i}>
          {i > 0 && ', '}
          <span className="bold-user-answer">
            {choices[Object.keys(choices)[a]]}
          </span>
        </React.Fragment>
      ));
    }
    if (type === 'drag-and-drop') {
      return drag_options.map((option, idx) => {
        const textInitial = option.text_initial ? option.text_initial + ' ' : '';
        const answerText = answer[idx] ? (
          <span key={idx} className="bold-user-answer">{answer[idx] + ' '}</span>
        ) : '______ ';
        const textFinal = option.text_final ? option.text_final + ' ' : '';
        return (
          <React.Fragment key={idx}>
            {textInitial}{answerText}{textFinal}
          </React.Fragment>
        );
      });
    }
    return '';
  };

  return (
    <div className={`resultado-page ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Header userData={userData} />
      <Sidebar isOpen={isSidebarOpen} handleToggle={handleSidebarToggle} />
      <div className="resultado-content">
        <div className="resultado-box">
          <h1 className="resultado-title">Resultado de la Prueba</h1>
          <p className="resultado-text">Su calificación es: {score} / {questions.length}</p>
          <div className="answers-box">
            <h2 className="answers-title">Respuestas:</h2>
            <ul className="answers-list">
              {questions.map((question, index) => (
                <li key={index} className="answer-item">
                  <p className="question">{question.attributes.name}</p>
                  <p className="user-answer">
                    Su respuesta: {renderUserAnswer(question, answers[index])}
                  </p>
                  <p className="correct-answer">
                    Respuesta correcta: {renderCorrectAnswer(question)}
                  </p>
                  <p className="explanation">
                    Explicación: {question.attributes.explication}
                  </p>
                </li>
              ))}
            </ul>
          </div>
          {isEligibleForCertificate && (
            <button className="certificado-button" onClick={generateCertificate}>
              Certificado
            </button>
          )}
          {!isEligibleForCertificate && (
            <p>No eligible for certificate</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultadoPage;
