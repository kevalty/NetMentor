import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './HeaderLog';
import Footer from './Footer';
import Alert from './Alert';
import Sidebar from './Sidebar21';
import './DiagnosticoPage.css';
import API_BASE_URL from '../config'; // Importa la URL base desde config.js

const DiagnosticoPage = () => {
  const [userData, setUserData] = useState(null);
  const [isExamActive, setIsExamActive] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [examGrade, setExamGrade] = useState(null);
  const [isExamTaken, setIsExamTaken] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // ID del test desde la URL
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

            // Verificar si el examen está tomado
            const takenTests = data.taken_tests;

            // Verificar si alguno de los tests en taken_tests coincide con el ID actual
            for (const takenTest of takenTests) {
              const takenTestResponse = await fetch(`${API_BASE_URL}taken-tests/${takenTest.id}?populate=*`, {
                method: 'GET',
                headers: {
                  Authorization: `Bearer ${jwt}`,
                },
              });
              if (takenTestResponse.ok) {
                const takenTestData = await takenTestResponse.json();
                if (takenTestData.data.attributes.tests.data.some(test => test.id === parseInt(id))) {
                  setIsExamTaken(true);
                  break;
                }
              }
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
  }, [id]);

  useEffect(() => {
    const fetchExamStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}tests/${id}`, {
          method: 'GET',
        });
        if (response.ok) {
          const data = await response.json();
          setIsExamActive(data.data.attributes.active === true || data.data.attributes.active === "true");
        } else {
          console.error('Error al obtener el estado de la prueba');
        }
      } catch (error) {
        console.error('Error de red al obtener el estado de la prueba:', error);
      }
    };

    const fetchUserGrades = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}users/me?populate=*`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          },
        });
        if (response.ok) {
          const user = await response.json();
          const diagnosticoGrades = user.results
            .filter(result => result.name === "Prueba Diagnostica")
            .map(result => result.grades);
          if (diagnosticoGrades.length > 0) {
            setExamGrade(Math.max(...diagnosticoGrades));
          }
        } else {
          console.error('Error al obtener las notas del usuario');
        }
      } catch (error) {
        console.error('Error de red al obtener las notas del usuario:', error);
      }
    };

    fetchExamStatus();
    if (!isExamActive) {
      fetchUserGrades();
    }
  }, [id, isExamActive]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/');
  };

  const handleStartExam = () => {
    setAlertOpen(true);
    setTimeout(() => {
      navigate(`/prueba-diagnostico/${id}`);
    }, 3000);
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div>
      <Header userData={userData} handleLogout={handleLogout} />
      <Sidebar isOpen={isSidebarOpen} handleToggle={handleSidebarToggle} />
      <div className={`diagnosis-page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <div className='contenido-clase-content2'>
       <div className="diagnosis-content">
          <h1 className="contenido-clase-title-diag">Prueba Diagnóstico</h1>
          <div className="contentdiag1">
            <div className="exam-info">
              {isExamActive ? (
                isExamTaken ? (
                  <p>Prueba Diagnóstico realizada con éxito, su nota es: {examGrade}</p>
                ) : (
                  <>
                    <p className="Parrafo">Prueba de diagnóstico</p>
                    <p>La prueba estará evaluada sobre 10</p>
                    <p>¡Cuando esté listo, haga clic en el botón para empezar!</p>
                    <button className="start-exam-button2" onClick={handleStartExam}>
                      Empezar Examen
                    </button>
                  </>
                )
              ) : (
                <p>El examen está desactivado o ya ha sido realizado.</p>
              )}
            </div>
          </div>
        </div>
       </div>
      </div>
      <Alert open={alertOpen} handleClose={handleCloseAlert} severity="success" message="El examen empezará en unos segundos" />
    </div>
  );
};

export default DiagnosticoPage;
