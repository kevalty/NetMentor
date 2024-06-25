// EditCursoModal.js
import React, { useState, useEffect } from 'react';

function EditCursoModal({ isOpen, onCloseModal, onSave, courseData, handleInputChange }) {
  const [newCourseName, setNewCourseName] = useState('');

  useEffect(() => {
    if (courseData) {
      setNewCourseName(courseData.curso);
    }
  }, [courseData]);

  const handleChange = (e) => {
    const { value } = e.target;
    setNewCourseName(value); // Actualiza el estado con el nuevo nombre del curso
    handleInputChange(e); // Propaga el cambio al componente padre
  };

  const handleSubmit = () => {
    onSave({ ...courseData, curso: newCourseName });
    onCloseModal(); // Cerrar el modal después de guardar
  };

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onCloseModal}>&times;</span>
        <h2>Editar Curso</h2>
        <form>
          <label htmlFor="curso">Nombre del Curso:</label>
          <input type="text" id="curso" name="curso" value={newCourseName} onChange={handleChange} />
          <button type="button" onClick={handleSubmit}>Guardar</button>
        </form>
      </div>
    </div>
  );
}

export default EditCursoModal;
