import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import AdminNavigationBar from './AdminNavigationBar';
import editarIcon from '../../assets/editar.png';
import eliminarIcon from '../../assets/eliminar.png';
import crearIcon from '../../assets/crear.png'; // Icono para agregar
import EditContentModal from './EditContentModal';
import DeleteContentModal from './DeleteContentModal';
import AddContentModal from './AddContentModal'; // Modal para agregar contenidos
import Alert from '../Alert'; // Importar tu componente de alerta bonita
import API_BASE_URL from '../../config'; // Importar la URL base desde config.js
import './ContenidoCruds.css';

function ContenidoCruds() {
  const [contents, setContents] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentToDelete, setContentToDelete] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false); // Nueva variable de estado para controlar la apertura del modal de agregar
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success'); // Nueva variable de estado para la severidad de la alerta
  const [alertOpen, setAlertOpen] = useState(false); // Nueva variable de estado para controlar la apertura de la alerta

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = () => {
    fetch(`${API_BASE_URL}contents`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al obtener los datos');
        }
        return response.json();
      })
      .then(data => {
        if (!Array.isArray(data.data)) {
          throw new Error('La respuesta de la API no contiene un array de datos');
        }
        const sortedData = data.data.sort((a, b) => a.attributes.name.localeCompare(b.attributes.name));
        setContents(sortedData);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setAlertSeverity('error'); // Configurar la severidad de la alerta como error
        setAlertMessage('Error al obtener los datos');
        setAlertOpen(true); // Abrir la alerta
      });
  };

  const handleEditClick = (content) => {
    setSelectedContent(content);
    setShowEditModal(true);
  };

  const handleDeleteClick = (contentId) => {
    setContentToDelete(contentId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    const contentId = contentToDelete;
    fetch(`${API_BASE_URL}contents/${contentId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al eliminar el contenido');
        }
        setAlertSeverity('success'); // Configurar la severidad de la alerta como éxito
        setAlertMessage('Contenido eliminado exitosamente');
        setAlertOpen(true); // Abrir la alerta
        fetchContents();
        setShowDeleteModal(false);
      })
      .catch(error => {
        console.error('Error deleting content:', error);
        setAlertSeverity('error'); // Configurar la severidad de la alerta como error
        setAlertMessage('Error al eliminar el contenido');
        setAlertOpen(true); // Abrir la alerta
      });
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleEditContent = (editedContentData) => {
    const contentId = selectedContent.id;
    fetch(`${API_BASE_URL}contents/${contentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: editedContentData })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al actualizar el contenido');
        }
        setAlertSeverity('success'); // Configurar la severidad de la alerta como éxito
        setAlertMessage('Contenido actualizado exitosamente');
        setAlertOpen(true); // Abrir la alerta
        fetchContents();
        setShowEditModal(false);
      })
      .catch(error => {
        console.error('Error updating content:', error);
        setAlertSeverity('error'); // Configurar la severidad de la alerta como error
        setAlertMessage('Error al actualizar el contenido');
        setAlertOpen(true); // Abrir la alerta
      });
  };

  const handleAddContent = (newContentData) => {
    fetch(`${API_BASE_URL}contents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: newContentData })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al agregar el contenido');
        }
        return response.json();
      })
      .then(data => {
        setAlertSeverity('success'); // Configurar la severidad de la alerta como éxito
        setAlertMessage('Contenido agregado exitosamente');
        setAlertOpen(true); // Abrir la alerta
        fetchContents();
        setShowAddModal(false);
      })
      .catch(error => {
        console.error('Error adding content:', error);
        setAlertSeverity('error'); // Configurar la severidad de la alerta como error
        setAlertMessage('Error al agregar el contenido');
        setAlertOpen(true); // Abrir la alerta
      });
  };

  const handleCloseAlert = () => {
    setAlertOpen(false); // Cerrar la alerta
  };

  return (
    <div className="admin-home-page">
      <AdminHeader />
      <AdminNavigationBar />
      <div className="admin-content">
        <div className="admin-content__container">
          <h2 className="admin-content__title">Contenido</h2>
          <div className="add-content" onClick={() => setShowAddModal(true)}>
            <img src={crearIcon} alt="Agregar contenido" className="add-icon" />
            <span className="add-title">Añadir Contenido</span>
          </div>
          <div className="admin-content__inner">
            {contents.map(content => (
              <div key={content.id} className="content-card">
                <h3 className="content-card__title">Nombre: {content.attributes.name}</h3>
                <div className="content-card__actions">
                  <img src={editarIcon} alt="Editar" className="action-icon" onClick={() => handleEditClick(content)} />
                  <img src={eliminarIcon} alt="Eliminar" className="action-icon" onClick={() => handleDeleteClick(content.id)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {showEditModal && <EditContentModal onCloseModal={() => setShowEditModal(false)} onSubmit={handleEditContent} content={selectedContent} />}
      {showAddModal && <AddContentModal onCloseModal={() => setShowAddModal(false)} onSubmit={handleAddContent} />}
      {showDeleteModal && <DeleteContentModal onCancel={handleDeleteCancel} onConfirm={handleDeleteConfirm} />}
      <Alert open={alertOpen} handleClose={handleCloseAlert} severity={alertSeverity} message={alertMessage} /> {/* Renderizar la alerta */}
    </div>
  );
}

export default ContenidoCruds;
