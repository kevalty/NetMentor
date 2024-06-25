import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './HeaderLog';
import Footer from './Footer';
import Sidebar from './Sidebar';
import './ContenidoClasePage.css'; // Renombrar a ContenidosPage.css para ser más específico
import comprobadoIcon from '../assets/comprobado.png'; // Importa el icono de comprobado
import API_BASE_URL from '../config'; // Importa la URL base desde config.js

const ContenidosPage = () => {
  const [userData, setUserData] = useState(null);
  const [contents, setContents] = useState([]);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const jwt = localStorage.getItem('jwt');
      if (!jwt) return;

      try {
        // Fetch user data
        const userResponse = await fetch(`${API_BASE_URL}users/me`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });

        if (!userResponse.ok) {
          console.error('Error al obtener los datos del usuario');
          return;
        }

        const userData = await userResponse.json();
        setUserData(userData);

        // Fetch contents
        const contentsResponse = await fetch(`${API_BASE_URL}contents`);
        if (!contentsResponse.ok) {
          console.error('Error al obtener los contenidos');
          return;
        }

        const contentsData = await contentsResponse.json();
        console.log('Datos de contenidos:', contentsData.data);

        // Fetch introductions for each content
        const contentsWithIntroductions = await Promise.all(
          contentsData.data.map(async (content) => {
            const introResponse = await fetch(`${API_BASE_URL}introductions?filters[content]=${content.id}`);
            if (introResponse.ok) {
              const introData = await introResponse.json();
              content.introduction = introData.data.length > 0 ? introData.data[0] : null;
            }
            return content;
          })
        );

        setContents(contentsWithIntroductions);
      } catch (error) {
        console.error('Error de red:', error);
      }
    };

    fetchData();
  }, []);

  const handleNavigateToClase = (contentId) => {
    navigate(`/clase/${contentId}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setUserData(null);
    navigate('/');
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`contenidos-page ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Header userData={userData} handleLogout={handleLogout} />
      <Sidebar isOpen={isSidebarOpen} handleToggle={handleSidebarToggle} />
      <div className="contenidos-content" style={{ display: 'flex', flexDirection: 'column' }}>
        <h1>Contenidos</h1>
        {Array.isArray(contents) && contents.length > 0 ? (
          contents.map((content, index) => (
            <div
              key={index}
              className="contenido-item"
              onClick={() => handleNavigateToClase(content.id)}
            >
              <h2>{content.attributes.name}</h2>
              {content.introduction && (
                <p>{content.introduction.attributes.name}</p>
              )}
              {content.attributes.comprobado && (
                <img 
                  src={comprobadoIcon} 
                  alt="Comprobado" 
                  className="comprobado-icon" 
                />
              )}
            </div>
          ))
        ) : (
          <p>No hay contenidos disponibles</p>
        )}
      </div>
    </div>
  );
};

export default ContenidosPage;
