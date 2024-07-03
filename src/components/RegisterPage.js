import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Header from './Header';
import ManualModal from './ManualModal';
import './RegisterPage.css';
import ojoIcon from '../assets/ojo.png';
import invisibleIcon from '../assets/invisible.png';
import RegisterIcon from '../assets/registerIcon.png';
import API_BASE_URL from '../config';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState({ username: '', email: '', password: '', name: '', lastname: '', confirmPassword: '', curso: '' });
  const [error, setError] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emptyFields, setEmptyFields] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [isUsernameFocused, setIsUsernameFocused] = useState(false);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isLastnameFocused, setIsLastnameFocused] = useState(false);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}cursos`);
        const result = await response.json();
        setCursos(result.data);
      } catch (error) {
        console.error('Error al cargar los cursos:', error);
      }
    };
    fetchCursos();
  }, []);

  const handleRegisterChange = e => {
    const { name, value } = e.target;
    setRegisterData(prevState => ({ ...prevState, [name]: value }));

    if (emptyFields.includes(name)) {
      setEmptyFields(emptyFields.filter(field => field !== name));
    }
  };

  const handleRegisterSubmit = async e => {
    e.preventDefault();
    const { username, email, password, name, lastname, confirmPassword, curso } = registerData;

    const empty = [];
    if (!username) empty.push('username');
    if (!email) empty.push('email');
    if (!password) empty.push('password');
    if (!name) empty.push('name');
    if (!lastname) empty.push('lastname');
    if (!confirmPassword) empty.push('confirmPassword');
    if (!curso) empty.push('curso');
    setEmptyFields(empty);

    if (empty.length > 0) {
      setError('Todos los campos son requeridos');
      setErrorOpen(true);
      return;
    }

    if (!isValidEmail(email)) {
      setError('El formato del correo electrónico es inválido');
      setErrorOpen(true);
      return;
    }

    if (/\s/.test(username) || !/^[a-zA-Z0-9]+$/.test(username)) {
      setError('El nombre de usuario solo puede contener letras y números, y no puede tener espacios');
      setErrorOpen(true);
      return;
    }

    if (!isValidPassword(password)) {
      setError('La contraseña debe tener al menos una mayúscula, un número y mínimo 8 caracteres');
      setErrorOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setErrorOpen(true);
      return;
    }

    try {
      const checkUsernameResponse = await fetch(`${API_BASE_URL}users?username=${username}`);
      if (!checkUsernameResponse.ok) {
        throw new Error('Error al verificar el nombre de usuario');
      }
      const userData = await checkUsernameResponse.json();

      const existingUser = userData.find(user => user.username === username);
      if (existingUser) {
        setError('El nombre de usuario ya está en uso');
        setErrorOpen(true);
        return;
      }

      const dataWithRole = { ...registerData, role: 3, confirmed: true }; // Set confirmed to true

      const response = await fetch(`${API_BASE_URL}users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithRole),
      });

      if (response.ok) {
        try {
          await fetch(`${API_BASE_URL}auth/email-confirmation?email=${email}`, {
            method: 'GET',
          });
        } catch (confirmationError) {
          console.error('Error al enviar el correo de confirmación:', confirmationError);
        }
        
        setError('');
        setRegisterData({ username: '', email: '', password: '', name: '', lastname: '', confirmPassword: '', curso: '' });
        setSuccessOpen(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.message || 'Error al registrar usuario');
        setErrorOpen(true);
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setError('Error al registrar usuario');
      setRegisterData({ username: '', email: '', password: '', name: '', lastname: '', confirmPassword: '', curso: '' });
      setErrorOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorOpen(false);
    setSuccessOpen(false);
  };

  const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPassword = password => /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
  const isValidName = name => /^[a-zA-Z\s]+$/.test(name);

  return (
    <div>
      <Header />
      <div className="register-page-specific">
        <section className='section1'>
          <form onSubmit={handleRegisterSubmit} className="register-form1">
            <h2>Registrarse</h2>
            <div className="input-container">
              <input
                type="text"
                name="name"
                value={registerData.name}
                onChange={handleRegisterChange}
                placeholder="Nombre *"
                onFocus={() => setIsNameFocused(true)}
                onBlur={() => setIsNameFocused(false)}
                style={{ borderColor: registerData.name ? (isValidName(registerData.name) ? 'green' : 'red') : '' }}
                required
              />
              {isNameFocused && (
                <div className="name-requirements">
                  <ul>
                    <li>Solo letras</li>
                  </ul>
                </div>
              )}
              <input
                type="text"
                name="lastname"
                value={registerData.lastname}
                onChange={handleRegisterChange}
                placeholder="Apellido *"
                onFocus={() => setIsLastnameFocused(true)}
                onBlur={() => setIsLastnameFocused(false)}
                style={{ borderColor: registerData.lastname ? (isValidName(registerData.lastname) ? 'green' : 'red') : '' }}
                required
              />
              {isLastnameFocused && (
                <div className="lastname-requirements">
                  <ul>
                    <li>Solo letras</li>
                  </ul>
                </div>
              )}
              <input
                type="text"
                name="username"
                value={registerData.username}
                onChange={handleRegisterChange}
                placeholder="Nombre de Usuario *"
                onFocus={() => setIsUsernameFocused(true)}
                onBlur={() => setIsUsernameFocused(false)}
                style={{ borderColor: registerData.username && (/\s/.test(registerData.username) || !/^[a-zA-Z0-9]+$/.test(registerData.username)) ? 'red' : (registerData.username ? 'green' : '') }}
                required
              />
              {isUsernameFocused && (
                <div className="username-requirements">
                  <ul>
                    <li>Solo letras y números</li>
                    <li>No puede contener espacios</li>
                  </ul>
                </div>
              )}
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                placeholder="Correo Electrónico *"
                onFocus={() => setIsEmailFocused(true)}
                onBlur={() => setIsEmailFocused(false)}
                style={{ borderColor: registerData.email ? (isValidEmail(registerData.email) ? 'green' : 'red') : '' }}
                required
              />
              {isEmailFocused && (
                <div className="email-requirements">
                  <ul>
                    <li>Debe ser un correo válido</li>
                    <li>Debe contener "@" y ".com"</li>
                  </ul>
                </div>
              )}
              <div className="password-input-container">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-button"
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                >
                  <img src={showPassword ? invisibleIcon : ojoIcon} alt="toggle password visibility" />
                </button>
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="Contraseña *"
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  style={{ borderColor: registerData.password ? (isValidPassword(registerData.password) ? 'green' : 'red') : '' }}
                />
              </div>
              {isPasswordFocused && (
                <div className="password-requirements">
                  <ul>
                    <li>Al menos una mayúscula</li>
                    <li>Al menos un número</li>
                    <li>Mínimo 8 caracteres</li>
                  </ul>
                </div>
              )}
              <div className="password-input-container">
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle-button"
                  style={{ backgroundColor: 'transparent', border: 'none' }}
                >
                  <img src={showConfirmPassword ? invisibleIcon : ojoIcon} alt="toggle password visibility" />
                </button>
                <input
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={registerData.confirmPassword}
                  onChange={handleRegisterChange}
                  placeholder="Confirmar Contraseña *"
                  style={{ borderColor: registerData.confirmPassword && registerData.confirmPassword === registerData.password ? 'green' : (registerData.confirmPassword ? 'red' : '') }}
                />
              </div>
              <select
                name="curso"
                value={registerData.curso}
                onChange={handleRegisterChange}
                className="custom-select"
                required
              >
                <option value="" disabled>Seleccione un curso *</option>
                {cursos.map(curso => (
                  <option key={curso.id} value={curso.id}>{curso.attributes.curso}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="register-button">
              <img src={RegisterIcon} alt="register" />
            </button>
          </form>
        </section>
        <section className='section2'>
          <div className='imagendiv'>
          </div>
        </section>
        <Snackbar open={successOpen} autoHideDuration={6000} onClose={handleClose}>
          <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity="success">
            ¡Registro exitoso! Por favor, revise su correo para verificar su cuenta.
          </MuiAlert>
        </Snackbar>
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

export default RegisterPage;
