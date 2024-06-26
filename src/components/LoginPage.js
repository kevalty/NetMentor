import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Header from './Header';
import Footer from './Footer';
import ManualModal from './ManualModal'; // Importa el componente ManualModal
import './LoginPage.css';
import imagen1 from '../assets/Inicio1.png';
import ojoIcon from '../assets/ojo.png';
import invisibleIcon from '../assets/invisible.png';
import loginIcon from '../assets/loginIcon.png';
import API_BASE_URL from '../config'; // Importa la URL base desde config.js

const LoginPage = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [errorOpen, setErrorOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // Nuevo estado para mostrar/ocultar la contraseña

  const handleLoginChange = e => {
    const { name, value } = e.target;
    setLoginData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleLoginSubmit = async e => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${API_BASE_URL}auth/local`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          identifier: loginData.username,
          password: loginData.password,
        }),
      });
  
      if (response.ok) {
        const { jwt } = await response.json();
        localStorage.setItem('jwt', jwt);
  
        // Fetch user information to determine role
        const userResponse = await fetch(`${API_BASE_URL}users/me?populate=*`, {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        const userData = await userResponse.json();
  
        // Get the role ID
        const roleId = userData.role.id;
  
        // Determine user role and redirect accordingly
        switch (roleId) {
          case 3: // Estudiante
            navigate('/main');
            break;
          case 4: // Admin
            navigate('/AdminHomePage');
            break;
          default:
            // Handle other roles or unexpected data
            navigate('/main');
        }
      } else {
        // Handle login error based on status code
        const responseData = await response.json();
        if (responseData.message) {
          setError(responseData.message);
        } else if (response.status === 500) {
          setError('Usuario o contraseña incorrectos.');
        }
        setErrorOpen(true);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Error al iniciar sesión');
      setErrorOpen(true);
    }
  };
  
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorOpen(false);
  };

  return (
    <div>
      <Header />
      <div className="login-page-specific">
        <section className='section1'>
          <form onSubmit={handleLoginSubmit} className="login-form1">
            <h2>Iniciar Sesión</h2>
            <input 
              type="text" 
              name="username" 
              value={loginData.username} 
              onChange={handleLoginChange} 
              placeholder="Nombre de Usuario *" 
              required
            />
            <div className="password-input-container">
                <input 
                  type={showPassword ? "text" : "password"} 
                  name="password" 
                  value={loginData.password} 
                  onChange={handleLoginChange} 
                  placeholder="Contraseña *" 
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="password-toggle-button"
                >
                  <img src={showPassword ? invisibleIcon : ojoIcon} alt="toggle password visibility" />
                </button>
            </div>
            <div className="button-container">
              <button type="submit" className="login-button">
                <img src={loginIcon} alt="login" />
              </button>
              <div className="olvi">
                <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
              </div>
            </div>
          </form>
        </section>
        <section className='section2-'>
          <div className='imagendiv'>
           
          </div>
          <div className='derecha'>
          </div>
        </section>
        <Snackbar open={errorOpen} autoHideDuration={6000} onClose={handleClose}>
          <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="error">
            {error}
          </MuiAlert>
        </Snackbar>
      </div>
      <ManualModal />
    </div>
  );
};

export default LoginPage;
