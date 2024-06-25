import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom'; // Importa useNavigate en lugar de useHistory
import iconoCerrarSesion from '../assets/iconoCerrarSesion.png';
import './Header.css';
import imagen1 from '../assets/logo.png';

const Header = ({ userData, handleLogout }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate(); // Utiliza useNavigate para obtener la función de navegación
  
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Función para manejar el logout
  const handleLogoutClick = () => {
    // Borra el token JWT del almacenamiento local o de sesión (dependiendo de cómo lo estés almacenando)
    localStorage.removeItem('token'); // Suponiendo que el token se almacena en el localStorage
    // Redirige al usuario a la página de inicio de sesión
    navigate("/"); // Utiliza navigate en lugar de history.push
  };

  return (
    <header className="netmentor-header">
      <div className="title">
        <img className='logo' src={imagen1} alt='Logo NetMentor' />
        <NavLink exact to="/main" className="t1" activeClassName="active">
          NetMentor
        </NavLink>
      </div>
      <div className="name" onMouseEnter={toggleMenu} onMouseLeave={toggleMenu}>
        {userData && (
          <span>{userData.username.toUpperCase()}</span>
        )}
        {showMenu && (
          <div className="dropdown-menu">
            <NavLink exact to="/profile" className="dropdown-item">Perfil</NavLink>
            <NavLink exact to="/calificaciones" className="dropdown-item">Calificaciones</NavLink>
            <button onClick={handleLogoutClick} className="dropdown-item">Logout</button> {/* Usa handleLogoutClick */}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
