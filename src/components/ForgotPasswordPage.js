import React, { useState } from 'react';
import Header from './Header';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import './ForgotPasswordPage.css';
import logo from '../assets/logo.png'; // Asegúrate de tener el logo en esta ruta
import API_BASE_URL from '../config'; // Importa la URL base desde config.js

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ForgotPasswordPage = ({ resetPasswordUrl }) => {
  const [email, setEmail] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [open, setOpen] = useState(false);

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
      setAlertMessage('Correo electrónico no es válido.');
      setAlertSeverity('error');
      setOpen(true);
      return;
    }

    try {
      const checkUserResponse = await fetch(`${API_BASE_URL}users?filters[email][$eq]=${email}`);
      const userData = await checkUserResponse.json();

      if (!userData || !userData.length) {
        setAlertMessage('No se encontró ningún usuario con este correo electrónico.');
        setAlertSeverity('error');
        setOpen(true);
        return;
      }

      const response = await fetch(`${API_BASE_URL}auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, URL: resetPasswordUrl }),
      });

      if (response.ok) {
        setAlertMessage('Se ha enviado un correo electrónico con instrucciones para restablecer tu contraseña.');
        setAlertSeverity('success');
        setOpen(true);
      } else {
        const data = await response.json();
        setAlertMessage(data.message || 'Error al enviar el correo electrónico');
        setAlertSeverity('error');
        setOpen(true);
      }
    } catch (error) {
      setAlertMessage('Error al enviar el correo electrónico, correo no encontrado');
      setAlertSeverity('error');
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <div className="forgot-password-container">
      <Header />
      <div className="forgot-password-content">
        <div className="forgot-password-form">
          <div className="form-header">
            <h2>Correo electrónico</h2>
            <img src={logo} alt="Logo" className="logo"/>
          </div>
          <p>Escribe tu correo electrónico para restablecer tu contraseña:</p>
          <form onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={handleEmailChange} />
            <button type="submit" className="reset-button" disabled={!email}>Restablece tu contraseña</button>
          </form>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity={alertSeverity}>
              {alertMessage}
            </Alert>
          </Snackbar>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
