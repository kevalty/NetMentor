import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config'; // Importa la URL base desde config.js
import Header from './HeaderLog';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import './ResetPassPage.css';

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const ResetPass = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState('success');
  const navigate = useNavigate();
  const location = useLocation();
  const [resetCode, setResetCode] = useState('');

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get('code');
    console.log('Código de restablecimiento recibido:', code); // Para depuración
    if (code) {
      setResetCode(code);
    } else {
      setError('Token no encontrado. Por favor, use el enlace de restablecimiento correcto.');
      setSeverity('error');
      setOpen(true);
    }
  }, [location.search]);

  const validatePassword = () => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    return hasUpperCase && hasNumber;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validatePassword()) {
      setError('La contraseña debe tener al menos una mayúscula y un número.');
      setSeverity('error');
      setOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      setSeverity('error');
      setOpen(true);
      return;
    }

    try {
      console.log('Enviando datos:', {
        code: resetCode,
        password,
        passwordConfirmation: confirmPassword,
      });

      const response = await axios.post(`${API_BASE_URL}auth/reset-password`, {
        code: resetCode,
        password,
        passwordConfirmation: confirmPassword,
      });

      console.log('Respuesta del servidor:', response.data);
      setMessage("Contraseña restablecida con éxito.");
      setSeverity('success');
      setOpen(true);
      setTimeout(() => navigate('/login'), 3000); // Redirigir después de 3 segundos
    } catch (err) {
      console.error('Error al restablecer la contraseña:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : 'Error al restablecer la contraseña. Por favor, inténtelo de nuevo.');
      setSeverity('error');
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
    <div className="reset-pass-container">
      <Header />
      <div className="reset-pass-content">
        <h2>Restablecer Contraseña</h2>
        <form className="reset-pass-form" onSubmit={handleSubmit}>
          <label htmlFor="password">Nueva Contraseña</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit">Restablecer Contraseña</button>
        </form>
      </div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
          {error || message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ResetPass;
