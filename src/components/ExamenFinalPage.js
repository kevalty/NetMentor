import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './HeaderLog';
import Footer from './Footer';
import Alert from './Alert';
import Sidebar from './Sidebar';
import './ExamenFinalPage.css';
import API_BASE_URL from '../config'; // Importa la URL base desde config.js

const FinalTestPage = () => {
  const [userData, setUserData] = useState(null);
  const [isTestAvailable, setIsTestAvailable] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [finalTestGrade, setFinalTestGrade] = useState(null);
  const [isTestTaken, setIsTestTaken] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
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

            const takenTests = data.taken_tests;
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
                  setIsTestTaken(true);
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
    const fetchTest = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}tests/${id}`);
        if (response.ok) {
          const { data } = await response.json();
          setIsTestAvailable(data.attributes.active);
        } else {
          console.error('Error al obtener los datos del test');
        }
      } catch (error) {
        console.error('Error de red al obtener los datos del test:', error);
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
          const finalTestGrades = user.results
            .filter(result => result.name === "Prueba Final")
            .map(result => result.grades);
          if (finalTestGrades.length > 0) {
            setFinalTestGrade(Math.max(...finalTestGrades));
          }
        } else {
          console.error('Error al obtener las notas del usuario');
        }
      } catch (error) {
        console.error('Error de red al obtener las notas del usuario:', error);
      }
    };

    fetchTest();
    if (!isTestAvailable) {
      fetchUserGrades();
    }
  }, [id, isTestAvailable]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/');
  };

  const startTest = () => {
    setAlertSeverity('success');
    setAlertMessage('El examen comenzará en unos segundos');
    setAlertOpen(true);
    setTimeout(() => {
      navigate(`/testfinal/${id}`);
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
      <div className={`final-test-page-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Sidebar isOpen={isSidebarOpen} handleToggle={handleSidebarToggle} />
        <main className="final-test-page-content">
          {isTestAvailable ? (
            isTestTaken ? (
              <div className="final-test-result">
                <h2>Prueba Final realizada con éxito, su nota es: {finalTestGrade}</h2>
                <p className="final-test-congratulations">¡Felicitaciones por completar la prueba final!</p>
              </div>
            ) : (
              <div className="final-test-content">
                <h1 className="contenido-clase-title-diag">Prueba Final</h1>
                <p>La prueba demorará 15 minutos, son 10 preguntas relacionadas a los contenidos vistos anteriormente, ¡MUCHA SUERTE!</p>
                <button className="start-test-button" onClick={startTest}>Iniciar Prueba</button>
              </div>
            )
          ) : (
            <div className="final-test-unavailable">
              <h2>La prueba aún no está disponible.</h2>
            </div>
          )}
        </main>
        <Alert open={alertOpen} handleClose={handleCloseAlert} severity={alertSeverity} message={alertMessage} />
      </div>
    </div>
  );
};

export default FinalTestPage;
