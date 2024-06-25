import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Header from './HeaderLog';
import imagen1 from '../assets/1.png';
import imagen2 from '../assets/2.png';
import imagen3 from '../assets/3.png';
import ManualModalLogeado from './ManualModalLogeado'; // Importa el componente ManualModalLogeado
import './MainPage.css';
import API_BASE_URL from '../config';

const MainPage = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/');
  };

  return (
    <div>
      <Header userData={userData} handleLogout={handleLogout} />
      <div className="main-page-container">
        <div className="main-page">
          <div className="left-box">
            <h2 className="courses-heading">Curso disponible</h2>
          </div>
          <div className="right-box">
            <Link to="/diagnostico/2" className="content-item">
              <img className='icons' src={imagen1} alt='Prueba Diagnóstica' />
              <span>Prueba Diagnóstica</span>
            </Link>
            <Link to="/contenido_clase" className="content-item">
              <img className='icons' src={imagen2} alt='Contenido de la Clase' />
              <span>Contenido de la Clase</span>
            </Link>
            <Link to="/examen_final/1" className="content-item">
              <img className='icons' src={imagen3} alt='Examen Final' />
              <span>Examen Final</span>
            </Link>
          </div>
        </div>
      </div>
      <ManualModalLogeado />
    </div>
  );
};

export default MainPage;
