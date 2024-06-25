import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Header from './Header';
import Footer from './Footer';
import ManualModal from './ManualModal'; // Importa el componente ManualModal
import './RegisterPage.css';
import imagen1 from '../assets/Inicio1.png';
import ojoIcon from '../assets/ojo.png';
import invisibleIcon from '../assets/invisible.png';
import RegisterIcon from '../assets/registerIcon.png';
import API_BASE_URL from '../config'; // Importa la URL base desde config.js
import '../App';

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

  useEffect(() => {
    // Cargar los cursos desde la API
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

    // Remover el campo vacío de la lista de campos vacíos si se ha llenado
    if (emptyFields.includes(name)) {
      setEmptyFields(emptyFields.filter(field => field !== name));
    }
  };

  const handleRegisterSubmit = async e => {
    e.preventDefault();
    const { username, email, password, name, lastname, confirmPassword, curso } = registerData;

    // Verificar campos vacíos
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

    // Verificar formato de correo electrónico
    if (!isValidEmail(email)) {
      setError('El formato del correo electrónico es inválido');
      setErrorOpen(true);
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setErrorOpen(true);
      return;
    }

    try {
      // Verificar si el nombre de usuario ya existe
      const checkUsernameResponse = await fetch(`${API_BASE_URL}users?username=${username}`);
      if (!checkUsernameResponse.ok) {
        throw new Error('Error al verificar el nombre de usuario');
      }
      const userData = await checkUsernameResponse.json();

      // Buscar si hay algún usuario con el mismo nombre de usuario
      const existingUser = userData.find(user => user.username === username);
      if (existingUser) {
        setError('El nombre de usuario ya está en uso');
        setErrorOpen(true);
        return;
      }

      const dataWithRole = { ...registerData, role: 3 };

      const response = await fetch(`${API_BASE_URL}users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataWithRole),
      });

      if (response.ok) {
        setError('');
        setRegisterData({ username: '', email: '', password: '', name: '', lastname: '', confirmPassword: '', curso: '' });
        setSuccessOpen(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Redirige a /login después de 2 segundos
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

  return (
    <div>
      <Header />
      <div className="register-page-specific">
        <section className='section1'>
          <form onSubmit={handleRegisterSubmit} className="register-form1">
            <h2>Registrarse</h2>
            <div className="input-container">
              <input type="text" name="name" value={registerData.name} onChange={handleRegisterChange} placeholder="Nombre *" required />
              <input type="text" name="lastname" value={registerData.lastname} onChange={handleRegisterChange} placeholder="Apellido *" required />
              <input type="text" name="username" value={registerData.username} onChange={handleRegisterChange} placeholder="Nombre de Usuario *" required />
              <input
                type="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterChange}
                placeholder="Correo Electrónico *"
                style={{ borderColor: registerData.email ? (isValidEmail(registerData.email) ? 'green' : 'red') : '' }}
                required
              />
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
                  style={{ borderColor: registerData.password ? (isValidPassword(registerData.password) ? 'green' : 'red') : '' }}
                />
              </div>
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
                  style={{ borderColor: registerData.confirmPassword && registerData.confirmPassword === registerData.password ? 'green' : '' }}
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
            <span style={{ color: 'gray', fontSize: '15px', marginLeft: '5px' }}>
              Las contraseñas deben contener: Al menos una mayúscula, un número y 8 caracteres
            </span>
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
            ¡Registro exitoso!
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
