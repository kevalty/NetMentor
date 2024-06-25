import React, { useState, useEffect } from 'react';
import AdminHeader from './AdminHeader';
import AdminNavigationBar from './AdminNavigationBar';
import editarIcon from '../../assets/editar.png';
import crearIcon from '../../assets/crear.png'; // Icono para agregar
import Alert from '../Alert'; // Importamos el componente de alerta
import './PruebasCruds.css';
import API_BASE_URL from '../../config'; // Importa la URL base desde config.js

function PruebasCruds() {
  const [tests, setTests] = useState([]);
  const [contents, setContents] = useState([]); // Estado para la lista de contenidos
  const [editingTest, setEditingTest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Nueva variable de estado para el modal de agregar
  const [editedTestData, setEditedTestData] = useState({
    id: "",
    name: "",
    description: "",
    type: "",
    time: "",
    contentId: "", // Nuevo campo para el ID del contenido relacionado
  });
  const [newTestData, setNewTestData] = useState({
    name: "",
    description: "",
    type: "",
    time: "",
    contentId: "", // Nuevo campo para el ID del contenido relacionado
  });
  const [alertOpen, setAlertOpen] = useState(false); // Estado para controlar la apertura de la alerta
  const [alertSeverity, setAlertSeverity] = useState('success'); // Estado para controlar el tipo de alerta (éxito o error)
  const [alertMessage, setAlertMessage] = useState(''); // Estado para controlar el mensaje de la alerta

  useEffect(() => {
    fetchTests();
    fetchContents();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}tests`);
      const data = await response.json();
      if (Array.isArray(data.data)) {
        console.log("Datos cargados desde la base de datos:", data.data);
        // Ordenar las pruebas antes de establecer el estado
        const sortedTests = data.data.sort((a, b) => a.id - b.id); // Cambia 'id' por el campo necesario si es otro
        setTests(sortedTests);
      } else {
        console.error('Error fetching tests: data is not an array');
      }
    } catch (error) {
      console.error('Error fetching tests:', error);
    }
  };

  const fetchContents = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}contents`);
      const data = await response.json();
      if (Array.isArray(data.data)) {
        setContents(data.data);
      } else {
        console.error('Error fetching contents: data is not an array');
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
    }
  };

  const handleEditTest = (test) => {
    console.log("ID de la prueba a editar:", test.id);
    setEditingTest(test);
    setEditedTestData({
      id: test.id,
      name: test.attributes.name,
      description: test.attributes.description,
      type: test.attributes.type,
      time: test.attributes.time,
      contentId: test.attributes.contentId || "", // Asignar el ID del contenido relacionado si existe
    });
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedTestData({
      ...editedTestData,
      [name]: value
    });
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setNewTestData({
      ...newTestData,
      [name]: value
    });
  };

  const handleSubmitEdit = async (e) => {
    e.preventDefault();
    try {
      const editedDataToSend = {
        data: {
          name: editedTestData.name,
          description: editedTestData.description,
          type: editedTestData.type,
          time: editedTestData.time,
          active: true
        }
      };

      console.log("ID de la prueba a editar:", editedTestData.id);
      console.log("Datos a enviar al editar la prueba:", editedDataToSend);

      const response = await fetch(`${API_BASE_URL}tests/${editedTestData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedDataToSend)
      });

      if (response.ok) {
        if (editedTestData.contentId) {
          await fetch(`${API_BASE_URL}contents/${editedTestData.contentId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: { test: editedTestData.id } })
          });
        }
        fetchTests();
        setIsModalOpen(false);
        setAlertSeverity('success');
        setAlertMessage('¡Prueba editada con éxito!');
        setAlertOpen(true);
      } else {
        console.error('Error al editar prueba:', response.statusText);
        setAlertSeverity('error');
        setAlertMessage('Error al editar la prueba');
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('Error al editar prueba:', error);
      setAlertSeverity('error');
      setAlertMessage('Error al editar la prueba');
      setAlertOpen(true);
    }
  };

  const handleSubmitAdd = async (e) => {
    e.preventDefault();
    try {
      const newTestToSend = {
        data: {
          name: newTestData.name,
          description: newTestData.description,
          type: newTestData.type,
          time: newTestData.time,
          active: true
        }
      };

      const response = await fetch(`${API_BASE_URL}tests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTestToSend)
      });

      if (response.ok) {
        const createdTest = await response.json();
        if (newTestData.contentId) {
          await fetch(`${API_BASE_URL}contents/${newTestData.contentId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: { test: createdTest.data.id } })
          });
        }
        fetchTests();
        setIsAddModalOpen(false);
        setAlertSeverity('success');
        setAlertMessage('¡Prueba agregada con éxito!');
        setAlertOpen(true);
      } else {
        console.error('Error al agregar prueba:', response.statusText);
        setAlertSeverity('error');
        setAlertMessage('Error al agregar la prueba');
        setAlertOpen(true);
      }
    } catch (error) {
      console.error('Error al agregar prueba:', error);
      setAlertSeverity('error');
      setAlertMessage('Error al agregar la prueba');
      setAlertOpen(true);
    }
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
  };

  const handleCancelAdd = () => {
    setIsAddModalOpen(false);
  };

  // Función para cerrar la alerta
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
            <h2 className="admin-content__title">Pruebas</h2>
            <div className="add-test" onClick={() => setIsAddModalOpen(true)}>
              <img src={crearIcon} alt="Agregar prueba" className="add-icon" />
              <span className="add-title">Añadir Prueba</span>
            </div>
            <div className="admin-content__inner">
              <div className="tests-container">
                {tests.map((test) => (
                  <div className="test-card" key={test.id}>
                    <div className="test-details">
                      <div>
                        <p>Nombre de la Prueba: {test.attributes.name}</p>
                        <p>Descripción: {test.attributes.description}</p>
                      </div>
                      <div>
                        <p>Tipo: {test.attributes.type}</p>
                        <p>Duración: {test.attributes.time} minutos</p>
                      </div>
                    </div>
                    <img
                      src={editarIcon}
                      alt="Editar"
                      className="edit-icon"
                      onClick={() => handleEditTest(test)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Alert
        open={alertOpen}
        handleClose={handleCloseAlert}
        severity={alertSeverity}
        message={alertMessage}
      />
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCancelEdit}>&times;</span>
            <h2>Editar Prueba</h2>
            <form onSubmit={handleSubmitEdit}>
              <label htmlFor="name">Nombre de la Prueba:</label>
              <input type="text" id="name" name="name" value={editedTestData.name} onChange={handleInputChange} required />
              <label htmlFor="description">Descripción:</label>
              <input type="text" id="description" name="description" value={editedTestData.description} onChange={handleInputChange} required />
              <label htmlFor="type">Tipo:</label>
              <input type="text" id="type" name="type" value={editedTestData.type} onChange={handleInputChange} required />
              <label htmlFor="time">Duración (minutos):</label>
              <input type="number" id="time" name="time" value={editedTestData.time} onChange={handleInputChange} required />
              <label htmlFor="contentId">Contenido relacionado:</label>
              <select id="contentId" name="contentId" value={editedTestData.contentId} onChange={handleInputChange} className="select-field">
                <option value="">Selecciona un contenido</option>
                {contents.map((content) => (
                  <option key={content.id} value={content.id}>{content.attributes.name}</option>
                ))}
              </select>
              <div>
                <button type="submit">Guardar cambios</button>
                <button type="button" className="cancel-btn" onClick={handleCancelEdit}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {isAddModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-btn" onClick={handleCancelAdd}>&times;</span>
            <h2>Agregar Prueba</h2>
            <form onSubmit={handleSubmitAdd}>
              <label htmlFor="name">Nombre de la Prueba:</label>
              <input type="text" id="name" name="name" value={newTestData.name} onChange={handleAddInputChange} required />
              <label htmlFor="description">Descripción:</label>
              <input type="text" id="description" name="description" value={newTestData.description} onChange={handleAddInputChange} required />
              <label htmlFor="type">Tipo:</label>
              <input type="text" id="type" name="type" value={newTestData.type} onChange={handleAddInputChange} required />
              <label htmlFor="time">Duración (minutos):</label>
              <input type="number" id="time" name="time" value={newTestData.time} onChange={handleAddInputChange} required />
              <label htmlFor="contentId">Contenido relacionado:</label>
              <select id="contentId" name="contentId" value={newTestData.contentId} onChange={handleAddInputChange} className="select-field">
                <option value="">Selecciona un contenido</option>
                {contents.map((content) => (
                  <option key={content.id} value={content.id}>{content.attributes.name}</option>
                ))}
              </select>
              <div>
                <button type="submit">Guardar</button>
                <button type="button" className="cancel-btn" onClick={handleCancelAdd}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PruebasCruds;
