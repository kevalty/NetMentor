import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import AdminNavigationBar from './AdminNavigationBar';
import editarIcon from '../../assets/editar.png';
import eliminarIcon from '../../assets/eliminar.png';
import crearIcon from '../../assets/crear.png'; // Icono para agregar
import SubcontentModal from './SubcontentModal'; // Modal para editar/agregar subcontenidos
import DeleteContentModal from './DeleteContentModal'; // Modal para eliminar subcontenidos
import Alert from '../Alert'; // Componente de alerta
import API_BASE_URL from '../../config'; // Importa la URL base desde config.js

function SubcontentsCruds2() {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [subcontents, setSubcontents] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSubcontent, setSelectedSubcontent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subcontentToDelete, setSubcontentToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertSeverity, setAlertSeverity] = useState('success');
  const [alertOpen, setAlertOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContent();
  }, [id]);

  const fetchContent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}contents/${id}?populate=*`);
      const data = await response.json();
      setContent(data.data.attributes);
      setSubcontents(data.data.attributes.subcontents.data);
    } catch (error) {
      console.error('Error fetching content:', error);
      setAlertSeverity('error');
      setAlertMessage('Error al obtener los datos');
      setAlertOpen(true);
    }
  };

  const handleEditClick = (subcontent) => {
    setSelectedSubcontent(subcontent);
    setShowEditModal(true);
  };

  const handleDeleteClick = (subcontentId) => {
    setSubcontentToDelete(subcontentId);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    const subcontentId = subcontentToDelete;
    fetch(`${API_BASE_URL}subcontents/${subcontentId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al eliminar el subcontenido');
        }
        setAlertSeverity('success');
        setAlertMessage('Subcontenido eliminado exitosamente');
        setAlertOpen(true);
        fetchContent();
        setShowDeleteModal(false);
      })
      .catch(error => {
        console.error('Error deleting subcontent:', error);
        setAlertSeverity('error');
        setAlertMessage('Error al eliminar el subcontenido');
        setAlertOpen(true);
      });
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  const handleEditSubcontent = (editedSubcontentData) => {
    const subcontentId = selectedSubcontent.id;
    fetch(`${API_BASE_URL}subcontents/${subcontentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: editedSubcontentData })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al actualizar el subcontenido');
        }
        setAlertSeverity('success');
        setAlertMessage('Subcontenido actualizado exitosamente');
        setAlertOpen(true);
        fetchContent();
        setShowEditModal(false);
      })
      .catch(error => {
        console.error('Error updating subcontent:', error);
        setAlertSeverity('error');
        setAlertMessage('Error al actualizar el subcontenido');
        setAlertOpen(true);
      });
  };

  const handleAddSubcontent = (newSubcontentData) => {
    fetch(`${API_BASE_URL}subcontents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: { ...newSubcontentData, content: id } })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error al agregar el subcontenido');
        }
        return response.json();
      })
      .then(data => {
        setAlertSeverity('success');
        setAlertMessage('Subcontenido agregado exitosamente');
        setAlertOpen(true);
        fetchContent();
        setShowAddModal(false);
      })
      .catch(error => {
        console.error('Error adding subcontent:', error);
        setAlertSeverity('error');
        setAlertMessage('Error al agregar el subcontenido');
        setAlertOpen(true);
      });
  };

  const handleCloseAlert = () => {
    setAlertOpen(false);
  };

  return (
    <div className="admin-home-page">
      <AdminHeader />
      <AdminNavigationBar />
      <div className="admin-content">
        <div className="admin-content__container">
          <h2 className="admin-content__title">Subcontenidos de {content?.name}</h2>
          <div className="add-subcontent" onClick={() => setShowAddModal(true)}>
            <img src={crearIcon} alt="Agregar subcontenido" className="add-icon" />
            <span className="add-title">Añadir Subcontenido</span>
          </div>
          <div className="admin-content__inner">
            <div className="contents-container">
              {subcontents.map((subcontent, index) => (
                <div className="content-card" key={index}>
                  <p>Nombre: {subcontent.attributes.name}</p>
                  <p>Material URL: {subcontent.attributes.material_url}</p>
                  <p>Video URL: {subcontent.attributes.video_url}</p>
                  <p>Juego URL: {subcontent.attributes.juego_url}</p>
                  <p>Refuerzo URL: {subcontent.attributes.refuerzo_url}</p>
                  <div className="content-card__actions">
                    <img src={editarIcon} alt="Editar" className="action-icon" onClick={() => handleEditClick(subcontent)} />
                    <img src={eliminarIcon} alt="Eliminar" className="action-icon" onClick={() => handleDeleteClick(subcontent.id)} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showEditModal && <SubcontentModal onCloseModal={() => setShowEditModal(false)} onSubmit={handleEditSubcontent} subcontent={selectedSubcontent} />}
      {showAddModal && <SubcontentModal onCloseModal={() => setShowAddModal(false)} onSubmit={handleAddSubcontent} subcontent={null} />}
      {showDeleteModal && <DeleteContentModal onCancel={handleDeleteCancel} onConfirm={handleDeleteConfirm} />}
      <Alert open={alertOpen} handleClose={handleCloseAlert} severity={alertSeverity} message={alertMessage} />
    </div>
  );
}

export default SubcontentsCruds2;
