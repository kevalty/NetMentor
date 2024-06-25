import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminNavigationBar from './AdminNavigationBar';
import API_BASE_URL from '../../config'; // Importa la URL base desde config.js
import './IntroduccionCruds.css';

function IntroduccionCruds() {
  const [contents, setContents] = useState([]);
  const navigate = useNavigate(); // Hook para la navegación

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = () => {
    fetch(`${API_BASE_URL}contents`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data.data)) {
          throw new Error('La respuesta de la API no contiene un array de datos');
        }
        const sortedContents = data.data.sort((a, b) => a.id - b.id); // Ordena los contenidos por ID u otro campo si es necesario
        setContents(sortedContents);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  const handleCardClick = (id) => {
    navigate(`/editintro/${id}`);
  };

  return (
    <div className="admin-home-page">
      <AdminHeader />
      <AdminNavigationBar />
      <div className="admin-content">
        <div className="admin-content__container">
          <h2 className="admin-content__title">Introducción</h2>
          <p className="admin-content__subtitle">Escoga el contenido al que desea añadir una introducción</p>
          <div className="admin-content__inner">
            {contents.map(content => (
              <div key={content.id} className="content-card" onClick={() => handleCardClick(content.id)}>
                <h3 className="content-card__title">Nombre: {content.attributes.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default IntroduccionCruds;
