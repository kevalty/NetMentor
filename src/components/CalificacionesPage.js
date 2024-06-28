import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-modal';
import Header from './HeaderLog';
import Sidebar from './Sidebar';
import ProgressChart from './ProgressChart'; // Importa el componente del gráfico
import './CalificacionesPage.css';
import API_BASE_URL from '../config'; // Importa la URL base desde config.js

Modal.setAppElement('#root'); // Necesario para accesibilidad

const CalificacionesPage = () => {
  const [userData, setUserData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [finalGrade, setFinalGrade] = useState(null);
  const [finalResult, setFinalResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const existingGradeId = useRef(null);

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
            calculateAndCompareGrade(data);
          } else {
            console.error('Error al obtener los datos del usuario');
          }
        } catch (error) {
          console.error('Error de red al obtener los datos del usuario:', error);
        }
      }
    };

    const calculateAndCompareGrade = async (data) => {
      console.log('Calculando la calificación final...');
      const results = data.results;

      let maxFinalGrade = -1;
      let maxDiagnosticGrade = -1;
      let otherGradesSum = 0;
      let totalGradesCount = 0;

      results.forEach(result => {
        console.log(`Evaluando resultado: ${result.name}, Nota: ${result.grades}`);
        if (result.name === "Prueba Final") {
          if (result.grades > maxFinalGrade) {
            maxFinalGrade = result.grades;
          }
        } else if (result.name === "Prueba Diagnostica") {
          if (result.grades > maxDiagnosticGrade) {
            maxDiagnosticGrade = result.grades;
          }
        } else {
          otherGradesSum += result.grades;
          totalGradesCount += 1;
        }
      });

      console.log(`maxFinalGrade: ${maxFinalGrade}`);
      console.log(`maxDiagnosticGrade: ${maxDiagnosticGrade}`);
      console.log(`otherGradesSum antes de incluir la mayor de Final/Diagnostica: ${otherGradesSum}`);
      console.log(`totalGradesCount antes de incluir la mayor de Final/Diagnostica: ${totalGradesCount}`);

      let highestFinalOrDiagnosticGrade = Math.max(maxFinalGrade, maxDiagnosticGrade);
      if (highestFinalOrDiagnosticGrade > -1) {
        otherGradesSum += highestFinalOrDiagnosticGrade;
        totalGradesCount += 1;
      }

      console.log(`highestFinalOrDiagnosticGrade: ${highestFinalOrDiagnosticGrade}`);
      console.log(`otherGradesSum después de incluir la mayor de Final/Diagnostica: ${otherGradesSum}`);
      console.log(`totalGradesCount después de incluir la mayor de Final/Diagnostica: ${totalGradesCount}`);

      let calculatedFinalGrade = otherGradesSum / totalGradesCount;
      console.log(`finalGrade calculada: ${calculatedFinalGrade}`);

      const calculatedFinalResult = calculatedFinalGrade >= 9 ? "Excelente" : calculatedFinalGrade >= 7 ? "Bueno" : calculatedFinalGrade >= 5 ? "Regular" : "Insuficiente";

      const gradeResponse = await fetch(`${API_BASE_URL}grades?filters[users_permissions_user][id][$eq]=${data.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        },
      });

      if (gradeResponse.ok) {
        const gradeData = await gradeResponse.json();
        if (gradeData.data.length > 0) {
          const existingGrade = gradeData.data[0];
          existingGradeId.current = existingGrade.id;
          const existingFinalGrade = existingGrade.attributes.final_grade;
          const existingFinalResult = existingGrade.attributes.results;

          if (existingFinalGrade !== calculatedFinalGrade || existingFinalResult !== calculatedFinalResult) {
            saveFinalGrade(data.id, calculatedFinalGrade, calculatedFinalResult, existingGradeId.current);
          }
        } else {
          saveFinalGrade(data.id, calculatedFinalGrade, calculatedFinalResult);
        }
      } else {
        console.error('Error al verificar las calificaciones del usuario');
      }

      setFinalGrade(calculatedFinalGrade);
      setFinalResult(calculatedFinalResult);
    };

    const saveFinalGrade = async (userId, finalGrade, finalResult, gradeId = null) => {
      const finalGradeData = {
        data: {
          users_permissions_user: userId,
          final_grade: finalGrade,
          results: finalResult
        }
      };

      try {
        const jwt = localStorage.getItem('jwt');
        let response;
        if (gradeId) {
          response = await fetch(`${API_BASE_URL}grades/${gradeId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify(finalGradeData)
          });
        } else {
          response = await fetch(`${API_BASE_URL}grades`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${jwt}`
            },
            body: JSON.stringify(finalGradeData)
          });
        }

        if (response.ok) {
          console.log('Calificación final guardada exitosamente');
        } else {
          console.error('Error al guardar la calificación final');
        }
      } catch (error) {
        console.error('Error de red al guardar la calificación final:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`profile-page ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Header userData={userData} />
      <Sidebar isOpen={isSidebarOpen} handleToggle={handleSidebarToggle} />

      <div className="calificaciones-container">
        <h2>Calificaciones del Estudiante</h2>
        {userData && userData.results && (
          <div className="calificaciones-table">
            {userData.results.map(calificacion => (
              <div key={calificacion.id} className="calificacion-row">
                <div className="calificacion-name">{calificacion.name}</div>
                <div className="calificacion-grade">{calificacion.grades}</div>
              </div>
            ))}
          </div>
        )}
        {finalGrade !== null && finalResult !== null && (
          <div className="final-grade">
            <h3>Calificación Final</h3>
            <div className="grade-box">
              <p className="grade-score">{finalGrade.toFixed(2)}</p>
              <p className="grade-result">{finalResult}</p>
            </div>
            <button onClick={openModal} className="progress-chart-button">Ver Progreso</button>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Gráfico de Progreso del Estudiante"
        className="modalcalif"
        overlayClassName="overlay"
      >
        <div className="modal-header">
          <h2>Progreso del Estudiante</h2>
        </div>
        <div className="modal-chart-container">
          {userData && userData.results && (
            <ProgressChart grades={userData.results} />
          )}
        </div>
        <div className="modal-footer">
          <button onClick={closeModal} className="close-modal-button">Cerrar</button>
        </div>
      </Modal>
    </div>
  );
};

export default CalificacionesPage;
