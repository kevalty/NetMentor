import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './HeaderLog';
import Footer from './Footer';
import Sidebar from './Sidebar'; // Importa el componente Sidebar
import './Contenido.css';
import API_BASE_URL from '../config'; // Importa la URL base desde config.js

const ContenidoClasePage = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Estado para manejar la visibilidad de la barra lateral

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
    setIsSidebarOpen(!isSidebarOpen); // Función para alternar la visibilidad de la barra lateral
  };

  return (
    <div className={`contenido-clase-page2 ${isSidebarOpen ? 'sidebar-open2' : ''}`}>
      <Header userData={userData} />
      <Sidebar isOpen={isSidebarOpen} handleToggle={handleSidebarToggle} /> {/* Incluye el componente Sidebar */}
      <div className='contenido-clase-content2'>
        <div className="contenido-clase-box2">
          <div className="contenido-clase-inner-content2">
            <h1 className="contenido-clase-title2">Introducción a Redes de Computadoras 2</h1>
            <p className="contenido-clase-description2">
              Las redes de computadoras 2 son...
              (aquí puedes agregar tu introducción)
            </p>
            <button className="contenido-clase-button2" onClick={() => navigate('/contents')}>
              Ver contenido
            </button>
          </div>
        </div>
      </div>
    </div>  
  );
};

export default ContenidoClasePage;
