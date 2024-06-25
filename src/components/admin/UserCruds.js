import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import AdminNavigationBar from './AdminNavigationBar';
import './UserCruds.css';
import editarIcon from '../../assets/editar.png';
import eliminarIcon from '../../assets/eliminar.png';
import DeleteContentModal from './DeleteContentModal'; // Importa el modal de confirmación
import Alert from '../Alert'; // Importa el nuevo componente de alerta
import API_BASE_URL from '../../config'; // Importa la URL base desde config.js

function UserCruds() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Cambiado a isEditModalOpen
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Nuevo estado para el modal de eliminación
  const [editedUserData, setEditedUserData] = useState({
    id: "",
    username: "",
    email: "",
    name: "",
    lastname: ""
  });
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}users`);
      const data = await response.json();
      
      // Ordenar los usuarios antes de establecer el estado
      const sortedUsers = data.sort((a, b) => a.id - b.id); // Puedes cambiar 'id' por el campo que necesites
      setUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteUser = async (user) => {
    setIsDeleteModalOpen(true); // Abrir el modal de eliminación
    setEditingUser(user); // Establecer el usuario en el estado de edición
  };

  const confirmDeleteUser = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}users/${editingUser.id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        const updatedUsers = users.filter(u => u.id !== editingUser.id);
        setUsers(updatedUsers);
        setAlertMessage("Usuario eliminado correctamente");
        setIsAlertOpen(true);
        setIsDeleteModalOpen(false); // Cerrar el modal de eliminación
      } else {
        console.error('Error al eliminar usuario:', response.statusText);
        setAlertMessage("Error al eliminar usuario");
        setIsAlertOpen(true);
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      setAlertMessage("Error al eliminar usuario");
      setIsAlertOpen(true);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setEditedUserData({
      id: user.id,
      username: user.username,
      email: user.email,
      name: user.name,
      lastname: user.lastname
    });
    setIsEditModalOpen(true);
  };

  const handleSubmitEdit = async (event) => {
    event.preventDefault(); // Evitar que se envíe el formulario de manera predeterminada
    
    try {
      const response = await fetch(`${API_BASE_URL}users/${editedUserData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedUserData)
      });
  
      if (response.ok) {
        fetchUsers();
        setAlertMessage("Usuario actualizado correctamente");
        setIsAlertOpen(true);
        setIsEditModalOpen(false);
        
        // Restablecer editingUser a null después de la edición exitosa
        setEditingUser(null);
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
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setEditedUserData({
      ...editedUserData,
      [name]: value
    });
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
  };

  const handleAlertClose = () => {
    setIsAlertOpen(false);
  };

  return (
    <div className="admin-home-page">
      <AdminHeader />
      <AdminNavigationBar />
      <div className="admin-content">
        <div className="admin-content__container">
          <h2 className="admin-content__title">Usuarios</h2>
          <div className="admin-content__inner">
            <div className="users-container">
              {users.map((user, index) => (
                <div className="user-card" key={index}>
                  <p>Username: {user.username}</p>
                  <p>Email: {user.email}</p>
                  <p>Name: {user.name}</p>
                  <p>Lastname: {user.lastname}</p>
                  <div className="user-actions">
                    <img
                      src={editarIcon}
                      alt="Editar"
                      className="edit-icon"
                      onClick={() => handleEditUser(user)}
                    />
                    <img
                      src={eliminarIcon}
                      alt="Eliminar"
                      className="delete-icon"
                      onClick={() => handleDeleteUser(user)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isEditModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCancelEdit}>&times;</span>
            <h2>Editar Usuario</h2>
            <form onSubmit={handleSubmitEdit}>
                <label htmlFor="username">Username:</label>
                <input type="text" id="username" name="username" value={editedUserData.username} onChange={handleInputChange} required />
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={editedUserData.email} onChange={handleInputChange} pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\.(com|ec|edu)" title="Por favor, introduce una dirección de correo electrónico válida" required />
                <span id="email-error" style={{ color: 'red', display: 'none' }}>Por favor, introduce una dirección de correo electrónico válida.</span>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" value={editedUserData.name} onChange={handleInputChange} pattern="[A-Za-z\s]+" title="Por favor, introduce solo letras" required />
                <label htmlFor="lastname">Lastname:</label>
                <input type="text" id="lastname" name="lastname" value={editedUserData.lastname} onChange={handleInputChange} pattern="[A-Za-z\s]+" title="Por favor, introduce solo letras" required />
                <div>
                  <button type="submit">Guardar cambios</button>
                  <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancelar</button>
                </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <DeleteContentModal
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDeleteUser}
        />
      )}

      <Alert open={isAlertOpen} handleClose={handleAlertClose} message={alertMessage} />
    </div>
  );
}

export default UserCruds;
