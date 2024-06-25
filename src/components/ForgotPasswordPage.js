import React, { useState } from 'react';
import Header from './HeaderLog';
import Footer from './Footer';
import './ForgotPasswordPage.css';
import API_BASE_URL from '../config'; // Importa la URL base desde config.js

const ForgotPasswordPage = ({ resetPasswordUrl }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEmailChange = e => {
    setEmail(e.target.value);
  };

  const validateEmail = email => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError('Correo electrónico no es válido.');
      setSuccessMessage('');
      return;
    }

    try {
      // Verificar si el usuario existe con el correo electrónico proporcionado
      const checkUserResponse = await fetch(`${API_BASE_URL}users?filters[email][$eq]=${email}`);
      const userData = await checkUserResponse.json();

      if (userData.data.length === 0) {
        setError('No se encontró ningún usuario con este correo electrónico.');
        setSuccessMessage('');
        return;
      }

      // Si se encuentra el usuario, enviar la solicitud para restablecer la contraseña
      const response = await fetch(`${API_BASE_URL}auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, URL: resetPasswordUrl }), // Pasar la URL base al servidor Strapi
      });

      if (response.ok) {
        setSuccessMessage('Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.');
        setError('');
      } else {
        const data = await response.json();
        setError(data.message || 'Error al enviar el correo electrónico');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error al enviar el correo electrónico:', error);
      setError('Error al enviar el correo electrónico, correo no encontrado ');
      setSuccessMessage('');
    }
  };

  return (
    <div className="forgot-password-container">
      <Header />
      <div className="forgot-password-content">
        <div className="forgot-password-form">
          <h2>Recuperar Contraseña</h2>
          <form onSubmit={handleSubmit}>
            <label>
              Correo Electrónico:
              <input type="email" value={email} onChange={handleEmailChange} />
            </label>
            <button type="submit">Enviar Correo Electrónico</button>
          </form>
          {error && <p>{error}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
