import React from 'react';
import { NavLink } from 'react-router-dom';
import './Header.css'; // Importa el archivo CSS
import imagen1 from '../assets/logo.png';

const Header = () => {
  return (
    <header className="netmentor-header">
      <div className="title">
        {/* Utiliza NavLink en lugar de un <span> */}
        <img className="logo" src={imagen1} alt="Logo NetMentor"></img>
        <NavLink exact to="/" className="t1" activeClassName="active">NetMentorre</NavLink>
      </div>
      <nav className="nav">
        <NavLink to="/login" className="link">Iniciar Sesión</NavLink>
        <NavLink to="/register" className="link">Registrarse</NavLink>
      </nav>
    </header>
  );
};

export default Header;
