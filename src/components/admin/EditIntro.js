import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminNavigationBar from './AdminNavigationBar';
import editarIcon from '../../assets/editar.png';
import eliminarIcon from '../../assets/eliminar.png';
import crearIcon from '../../assets/crear.png';
import EditModal from './EditModalIntro';
import Alert from '../Alert';
import DeleteContentModal from './DeleteContentModal';
import './EditIntro.css';
import CreateIntroModal from './CrearModalIntro';
import API_BASE_URL from '../../config'; // Importa la URL base desde config.js

function EditIntro() {
  const { id } = useParams();
  const [introData, setIntroData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [introductionId, setIntroductionId] = useState(null);
  const [contentId, setContentId] = useState(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertMessage, setAlertMessage] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setContentId(id);
    fetchIntroData();
  }, [id]);

  const fetchIntroData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}contents/${id}?populate=*`);
      const data = await response.json();
      console.log(data);

      if (data.data && data.data.attributes && data.data.attributes.introduction && data.data.attributes.introduction.data && data.data.attributes.introduction.data.id) {
        const introductionId = data.data.attributes.introduction.data.id;
        console.log("ID de la introducción:", introductionId);
        setIntroductionId(introductionId);

        if (data.data.attributes.introduction.data.attributes) {
          setIntroData(data.data.attributes.introduction.data.attributes);
        } else {
          setIntroData(null);
        }

        if (data.data.attributes.id) {
          setContentId(data.data.attributes.id);
        }
      } else {
        console.error('No se pudo obtener el ID de la introducción.');
        setIntroData(null);
      }
    } catch (error) {
      console.error('Error fetching introduction data:', error);
    }
  };

  const handleEditIntro = () => {
    setShowEditModal(true);
  };

  const handleDeleteIntro = () => {
    if (introductionId) {
      setAlertSeverity('warning');
      setAlertMessage('¿Estás seguro de que quieres eliminar esta introducción? Esta acción no se puede deshacer.');
      setConfirmDeleteOpen(true);
    } else {
      console.error('ID de introducción no válido');
      setAlertSeverity('error');
      setAlertMessage('¡ID de introducción no válido!');
      setAlertOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}introductions/${introductionId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Introducción eliminada correctamente');
        setAlertSeverity('success');
        setAlertMessage('¡Introducción eliminada correctamente!');
        setAlertOpen(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        console.error('Error al eliminar la introducción:', response.statusText);
        setAlertSeverity('error');
        setAlertMessage('¡Hubo un error al eliminar la introducción!');
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('Error al eliminar la introducción:', error.message);
      setAlertSeverity('error');
      setAlertMessage('¡Hubo un error al eliminar la introducción!');
      setAlertOpen(true);
    } finally {
      setConfirmDeleteOpen(false);
    }
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveIntro = async (newName) => {
    try {
      if (introductionId) {
        const response = await fetch(`${API_BASE_URL}introductions/${introductionId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            data: {
              name: newName,
              content: contentId,
            },
          }),
        });

        if (response.ok) {
          console.log('Introducción actualizada correctamente');
          setIntroData({
            ...introData,
            name: newName,
          });
          setAlertSeverity('success');
          setAlertMessage('¡Introducción actualizada correctamente!');
          setAlertOpen(true);
        } else {
          console.error('Error al actualizar la introducción:', response.statusText);
          setAlertSeverity('error');
          setAlertMessage('¡Hubo un error al actualizar la introducción!');
          setAlertOpen(true);
        }
      } else {
        console.error('ID de introducción no válido');
        setAlertSeverity('error');
        setAlertMessage('¡ID de introducción no válido!');
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('Error al actualizar la introducción:', error.message);
      setAlertSeverity('error');
      setAlertMessage('¡Hubo un error al actualizar la introducción!');
      setAlertOpen(true);
    }
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
  };

  const handleConfirmDeleteClose = () => {
    setConfirmDeleteOpen(false);
  };

  const handleCreateIntro = () => {
    setShowCreateModal(true);
  };

  const handleSaveNewIntro = async (newIntroName, contentId) => {
    try {
      const newData = {
        data: {
          name: newIntroName,
          content: contentId,
        },
      };
  
      console.log('Datos a enviar:', newData);

      const response = await fetch(`${API_BASE_URL}introductions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      if (response.ok) {
        console.log('Introducción creada correctamente');
        setAlertSeverity('success');
        setAlertMessage('¡Introducción creada correctamente!');
        setAlertOpen(true);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        console.error('Error al crear la introducción:', response.statusText);
        setAlertSeverity('error');
        setAlertMessage('¡Hubo un error al crear la introducción!');
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('Error al crear la introducción:', error.message);
      setAlertSeverity('error');
      setAlertMessage('¡Hubo un error al crear la introducción!');
      setAlertOpen(true);
    } finally {
      setShowCreateModal(false);
    }
  };

  return (
    <div className="admin-home-page">
      <AdminHeader />
      <AdminNavigationBar />
      <div className="admin-content">
        <div className="admin-content__container">
          <h2 className="admin-content__title">Editar Introducción</h2>
          <div className="admin-content__inner">
            {introData ? (
              <div className="intro-card">
                <h3 className="intro-card__title">Nombre: {introData.name}</h3>
                <p className="intro-card__date">Creado el: {introData.createdAt}</p>
                <p className="intro-card__date">Actualizado el: {introData.updatedAt}</p>
                <div className="intro-card__actions">
                  <img src={editarIcon} alt="Editar" className="action-icon" onClick={handleEditIntro} />
                  <img src={eliminarIcon} alt="Eliminar" className="action-icon" onClick={handleDeleteIntro} />
                </div>
              </div>
            ) : (
              <div className="no-intro">
                <p>No se encontró ninguna introducción.</p>
                <button onClick={handleCreateIntro} className="create-intro-btn">
                  <img src={crearIcon} alt="Crear" className="create-intro-icon" />
                  Crear Introducción
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {showEditModal && <EditModal onCloseModal={handleCloseEditModal} onSave={handleSaveIntro} introductionData={introData} />}
      {showCreateModal && <CreateIntroModal isOpen={showCreateModal} onCloseModal={() => setShowCreateModal(false)} onSave={handleSaveNewIntro} contentId={contentId} />}
      <Alert open={alertOpen} handleClose={handleAlertClose} severity={alertSeverity} message={alertMessage} />
      {confirmDeleteOpen && <DeleteContentModal onCancel={handleConfirmDeleteClose} onConfirm={handleConfirmDelete} />}
    </div>
  );
}

export default EditIntro;
