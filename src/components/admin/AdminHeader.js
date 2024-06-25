import React, { useState, useEffect } from 'react';
import logo from '../../assets/logo.png'; // Ajusta la ruta según sea necesario
import './AdminHeader.css';

function AdminHeader() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const jwt = localStorage.getItem('jwt');
      if (jwt) {
        try {
          const response = await fetch('http://localhost:1337/api/users/me', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUsername(data.username); // Asumiendo que el nombre de usuario está en la propiedad 'username'
          } else {
            console.error('Error al obtener los datos del usuario');
          }
        } catch (error) {
          console.error('Error de red al obtener los datos del usuario:', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    window.location.href = '/login'; // Redirige a la página de login
  };

  return (
    <header className="admin-header">
      <div className="admin-header__logo">
      </div>
      <div className="admin-header__admin-section">
        <span>{`Admin: ${username}`}</span>
      </div>
    </header>
  );
}

export default AdminHeader;
