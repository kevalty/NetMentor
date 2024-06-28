import React from 'react';
import './sidebarAdmin.css';
import 'boxicons';
import imagen1 from '../../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';

const schemaPages = {
    Curso: "/CursoCruds",
    Contenidos: "/ContenidoCruds",
    SubContenidos: "/subcontentCruds",
    Calificaciones: "/CalificacionCruds",
    Introduccion: "/IntroduccionCruds",
    Preguntas: "/PreguntaCruds",
    Resultados: "/ResultadoCruds",
    Pruebas: "/PruebaCruds",
    Usuarios: "/UserCruds"
};

const Sidebar = () => {
    const navigate = useNavigate();

    const handleToggle = () => {
        const sidebar = document.querySelector('.sidebar');
        sidebar.classList.toggle("close");
    };

    const handleLogout = () => {
        localStorage.removeItem('jwt');
        navigate('/'); // Redirige al usuario a la página principal
    };

    return (
        <nav className="sidebar close">
            <header>
                <div className="image-text">
                    <span className="image">
                        <img src={imagen1} alt="NetMentor Logo" />
                    </span>
                    <div className="text logo-text">
                        <span className="name">NetMentor</span>
                    </div>
                </div> 
                <i className='bx bx-chevron-right toggle' onClick={handleToggle}></i>
            </header>
            <div className="menu-bar">
                <div className="menu">
                    <ul className="menu-links">
                        <li className="nav-link">
                            <a href="#" onClick={() => window.history.back()}>
                                <i className='bx bx-arrow-back icon'></i>
                                <span className="text nav-text">Atrás</span>
                            </a>
                        </li>
                        {Object.keys(schemaPages).map((key) => (
                            <li className="nav-link" key={key}>
                                <Link to={schemaPages[key]}>
                                    <i className='bx bx-book-open icon'></i>
                                    <span className="text nav-text">{key}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="bottom-content">
                    <li className="nav-link">
                        <a href="#" onClick={handleLogout}>
                            <i className='bx bx-log-out icon'></i>
                            <span className="text nav-text">Logout</span>
                        </a>
                    </li>
                </div>
            </div>
        </nav>
    );
};

export default Sidebar;
