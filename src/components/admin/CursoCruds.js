import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import AdminNavigationBar from './AdminNavigationBar';
import './CursoCruds.css';
import editarIcon from '../../assets/editar.png';
import crearIcon from '../../assets/crear.png'; // Icono para agregar
import EditCursoModal from './EditCursoModal'; // Importa el componente del modal de edición
import AddCursoModal from './AddCursoModal'; // Importa el componente del modal para agregar
import Alert from '../Alert'; // Importa el componente de alerta
import API_BASE_URL from '../../config'; // Importa la URL base desde config.js

function CursoCruds() {
  const [cursos, setCursos] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [editedCourseData, setEditedCourseData] = useState({
    id: "",
    curso: "",
  });
  const [showAddModal, setShowAddModal] = useState(false); // Nueva variable de estado para controlar la apertura del modal de agregar
  const [alertOpen, setAlertOpen] = useState(false); // Estado para controlar la apertura de la alerta
  const [alertSeverity, setAlertSeverity] = useState('success'); // Estado para controlar el tipo de alerta (éxito o error)
  const [alertMessage, setAlertMessage] = useState(''); // Estado para controlar el mensaje de la alerta

  useEffect(() => {
    fetchCursos();
  }, []);

  const fetchCursos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}cursos`);
      const data = await response.json();
      if (Array.isArray(data.data)) {
        const sortedData = data.data.sort((a, b) => a.attributes.curso.localeCompare(b.attributes.curso));
        setCursos(sortedData);
      } else {
        console.error('Error fetching cursos: data is not an array');
      }
    } catch (error) {
      console.error('Error fetching cursos:', error);
    }
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setEditedCourseData({
      id: course.id,
      curso: course.attributes.curso,
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCourseData({
      ...editedCourseData,
      [name]: value
    });
  };

  const handleSubmitEdit = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}cursos/${editedCourseData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: {
            curso: editedCourseData.curso
          }
        })
      });

      if (response.ok) {
        fetchCursos(); // Actualiza la lista de cursos después de editar
        setShowEditModal(false);
        setAlertSeverity('success');
        setAlertMessage('¡Curso editado con éxito!');
        setAlertOpen(true);
      } else {
        console.error('Error al editar curso:', response.statusText);
        setAlertSeverity('error');
        setAlertMessage('Error al editar el curso');
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('Error al editar curso:', error);
      setAlertSeverity('error');
      setAlertMessage('Error al editar el curso');
      setAlertOpen(true);
    }
  };

  const handleAddCourse = async (newCourseData) => {
    try {
      const response = await fetch(`${API_BASE_URL}cursos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: newCourseData })
      });

      if (response.ok) {
        fetchCursos(); // Actualiza la lista de cursos después de agregar
        setShowAddModal(false);
        setAlertSeverity('success');
        setAlertMessage('¡Curso agregado con éxito!');
        setAlertOpen(true);
      } else {
        console.error('Error al agregar curso:', response.statusText);
        setAlertSeverity('error');
        setAlertMessage('Error al agregar el curso');
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('Error al agregar curso:', error);
      setAlertSeverity('error');
      setAlertMessage('Error al agregar el curso');
      setAlertOpen(true);
    }
  };

  const handleCloseAlert = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setAlertOpen(false);
  };

  return (
    <div>
      <AdminHeader />
      <AdminNavigationBar />
      <div className="admin-home-page">
        <div className="admin-content">
          <div className="admin-content__container">
            <h2 className="admin-content__title">Cursos</h2>
            <div className="add-course" onClick={() => setShowAddModal(true)}>
              <img src={crearIcon} alt="Agregar curso" className="add-icon" />
              <span className="add-title">Añadir Curso</span>
            </div>
            <div className="admin-content__inner">
              {cursos.map((curso) => (
                <div className="curso-card" key={curso.id}>
                  <div className="curso-details">
                    <p>Curso: {curso.attributes.curso}</p>
                  </div>
                  <img
                    src={editarIcon}
                    alt="Editar"
                    className="edit-icon"
                    onClick={() => handleEditCourse(curso)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {showEditModal && (
        <EditCursoModal
          isOpen={showEditModal}
          onCloseModal={() => setShowEditModal(false)}
          onSave={handleSubmitEdit}
          courseData={editedCourseData}
          handleInputChange={handleInputChange}
        />
      )}
      {showAddModal && (
        <AddCursoModal
          isOpen={showAddModal}
          onCloseModal={() => setShowAddModal(false)}
          onSave={handleAddCourse}
        />
      )}
      <Alert
        open={alertOpen}
        handleClose={handleCloseAlert}
        severity={alertSeverity}
        message={alertMessage}
      />
    </div>
  );
}

export default CursoCruds;
