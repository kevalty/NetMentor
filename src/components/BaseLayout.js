import React from 'react';
import backgroundImage from '../assets/background.jpg';
import logo from '../assets/logo.jpeg';
import './BaseLayout.css'; // Estilos comunes

const BaseLayout = ({ children }) => {
  return (
    <div className="base-layout" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="header">
        <div className="logo-container">
          <img src={logo} alt="Logo" className="logo" />
        </div>
        {/* Otras partes comunes del encabezado */}
      </div>
      <div className="content">
        {children} {/* Contenido específico de cada página */}
      </div>
      <footer className="footer">
        Realizado por Kevin Bedon - Arleth Caceres
      </footer>
    </div>
  );
};

export default BaseLayout;