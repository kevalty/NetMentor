import React from 'react';
import AdminHeader from './AdminHeader';
import AdminNavigationBar from './AdminNavigationBar';
import './AdminHomePage.css'
import logo from '../../assets/logo.png';

function AdminHomePage() {
  return (
    <div className="admin-home-page">
      <AdminHeader />
      <AdminNavigationBar />
      <div className="admin-content">
        <div className="admin-content__container1">
        <h2 className="admin-content__title1">Admin1</h2>
          <div className="admin-content__inner1">
            <img src={logo} alt="Logo" className="admin-content__logo1" />
            <p className="admin-content__text1">
              Conectando el mundo, un bit a la vez <br/>
              ¡Bienvenido a nuestra aplicación sobre redes de computadoras! Aquí encontrarás todo lo que necesitas saber para comprender y gestionar redes de manera eficiente. Desde conceptos básicos hasta tecnologías avanzadas, estamos aquí para guiarte en tu viaje por el mundo de las redes. Descubre información útil, consejos prácticos y herramientas útiles para optimizar el rendimiento de tus redes. ¡Con nuestra aplicación, dominar las redes de computadoras nunca ha sido tan fácil y emocionante!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHomePage;
