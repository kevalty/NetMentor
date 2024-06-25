import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import AdminHeader from './AdminHeader'; // Importa el componente AdminHeader
import AdminNavigationBar from './AdminNavigationBar'; // Importa la barra de navegación
import API_BASE_URL from '../../config'; // Importa la URL base desde config.js
import './PreguntasCruds.css'; // Importa los estilos CSS

function PreguntaCruds() {
  const [tests, setTests] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState(null);

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}tests`);
      const data = await response.json();
      console.log(data); // Verifica los datos de respuesta
      if (Array.isArray(data.data)) {
        const sortedTests = data.data.sort((a, b) => a.id - b.id); // Ordena los tests por ID u otro campo si es necesario
        setTests(sortedTests); // Actualiza el estado con los datos de los tests ordenados
      } else {
        console.error('Error fetching tests: data is not an array');
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const handleTestClick = (testId) => {
    setSelectedTestId(testId);
  };

  // Si se ha seleccionado un test, redirige a la página de detalles del test
  if (selectedTestId) {
    return <Navigate to={`/test/${selectedTestId}`} />;
  }

  return (
    <div className="admin-home-page">
      <AdminHeader />
      <AdminNavigationBar />
      <div className="admin-content">
        <div className="admin-content__container">
          <h2 className="admin-content__title">Tests</h2>
          <p className="admin-content__subtitle">Escoga el examen al que desea agregar preguntas</p>
          <div className="admin-content__inner">
            <div className="tests-container">
              {tests.map((test, index) => (
                <div className="test-card" key={index} onClick={() => handleTestClick(test.id)}>
                  <div className="test-details">
                    <h3 className="test-name">Name: {test.attributes.name}</h3>
                    <p className="test-description">Description: {test.attributes.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PreguntaCruds;
