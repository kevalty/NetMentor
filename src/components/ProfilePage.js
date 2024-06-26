import React, { useState, useEffect } from 'react';
import Header from './HeaderLog';
import Sidebar from './Sidebar';
import './ProfilePage.css';
import API_BASE_URL from '../config';

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    lastname: '',
    email: '',
    username: '',
    profilePicture: null,
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const jwt = localStorage.getItem('jwt');
      if (jwt) {
        try {
          const response = await fetch(`${API_BASE_URL}users/me?populate=*`, {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${jwt}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
            setFormData({
              name: data.name,
              lastname: data.lastname,
              email: data.email,
              username: data.username,
              profilePicture: null,
            });
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

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      profilePicture: e.target.files[0],
    });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const jwt = localStorage.getItem('jwt');
    if (jwt && userData && userData.id) {
      try {
        // Actualizar datos del perfil
        const response = await fetch(`${API_BASE_URL}users/${userData.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${jwt}`,
          },
          body: JSON.stringify({
            name: formData.name,
            lastname: formData.lastname,
            email: formData.email,
            username: formData.username,
          }),
        });

        if (response.ok) {
          const data = await response.json();

          // Actualizar foto de perfil si se selecciona una nueva
          if (formData.profilePicture) {
            const formDataObj = new FormData();
            formDataObj.append('files', formData.profilePicture);
            formDataObj.append('ref', 'plugin::users-permissions.user'); // Actualizar referencia correcta
            formDataObj.append('refId', data.id);
            formDataObj.append('field', 'profilePicture');

            const uploadResponse = await fetch(`${API_BASE_URL}upload`, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${jwt}`,
              },
              body: formDataObj,
            });

            if (uploadResponse.ok) {
              const uploadData = await uploadResponse.json();
              data.profilePicture = uploadData[0]; // Actualizar el objeto data con la nueva foto de perfil
            } else {
              console.error('Error al subir la foto de perfil');
            }
          }

          setUserData(data); // Actualizar el estado de userData con los nuevos datos
          setAlertMessage("Usuario actualizado correctamente");
          setIsAlertOpen(true);
          setIsEditing(false);
        } else {
          console.error('Error al actualizar usuario:', response.statusText);
          setAlertMessage("Error al actualizar usuario");
          setIsAlertOpen(true);
        }
      } catch (error) {
        console.error('Error al actualizar usuario:', error);
        setAlertMessage("Error al actualizar usuario");
        setIsAlertOpen(true);
      }
    }
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
  };

  const getProfilePictureUrl = (userData) => {
    return userData && userData.profilePicture ? `https://localhost:1337${userData.profilePicture.url}` : 'https://via.placeholder.com/150';
  };

  return (
    <div className={`profile-page ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Header userData={userData} />
      <Sidebar isOpen={isSidebarOpen} handleToggle={handleSidebarToggle} />
      <div className="user-profile">
        <div className="profile-summary">
          {userData && (
            <>
              <img
                src={getProfilePictureUrl(userData)}
                alt="Profile"
              />
              <h2>{userData.name} {userData.lastname}</h2>
              <button className="contenido-clase-button3" onClick={handleEditToggle}>
                {isEditing ? 'Cancelar' : 'Editar Perfil'}
              </button>
            </>
          )}
        </div>
        {isEditing ? (
          <form onSubmit={handleFormSubmit} className="edit-profile-form">
            <div className="form-group">
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastname">Apellido:</label>
              <input
                type="text"
                id="lastname"
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo electrónico:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="username">Nombre de usuario:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="profilePicture">Foto de perfil:</label>
              <input
                type="file"
                id="profilePicture"
                name="profilePicture"
                onChange={handleFileChange}
              />
            </div>
            <button className="contenido-clase-button3" type="submit">Guardar Cambios</button>
          </form>
        ) : (
          <div className="profile-details">
            <h2>Datos de perfil</h2>
            {userData && (
              <>
                <div className="info-box">
                  <h3>Nombre de usuario:</h3>
                  <p>{userData.username}</p>
                </div>
                <div className="info-box">
                  <h3>Correo electrónico:</h3>
                  <p>{userData.email}</p>
                </div>
                <div className="info-box">
                  <h3>Nombre:</h3>
                  <p>{userData.name}</p>
                </div>
                <div className="info-box">
                  <h3>Apellido:</h3>
                  <p>{userData.lastname}</p>
                </div>
                <div className="info-box">
                  <h3>Rol:</h3>
                  <p>{userData.role ? userData.role.name : 'Rol no disponible'}</p>
                </div>
                <div className="info-box">
                  <h3>Curso:</h3>
                  <p>{userData.curso ? userData.curso.curso : 'Curso no disponible'}</p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {isAlertOpen && (
        <div className="alert">
          <p>{alertMessage}</p>
          <button onClick={handleAlertClose}>Cerrar</button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
