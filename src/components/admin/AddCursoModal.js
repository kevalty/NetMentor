import React, { useState } from 'react';

function AddCursoModal({ isOpen, onCloseModal, onSave }) {
  const [newCourseData, setNewCourseData] = useState({
    curso: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewCourseData({
      ...newCourseData,
      [name]: value
    });
  };

  const handleSubmit = () => {
    onSave(newCourseData);
  };

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className="modal-content">
        <h3>Agregar Curso</h3>
        <input
          type="text"
          name="curso"
          placeholder="Nombre del curso"
          value={newCourseData.curso}
          onChange={handleInputChange}
        />
        <button onClick={handleSubmit}>Guardar</button>
        <button onClick={onCloseModal}>Cancelar</button>
      </div>
    </div>
  );
}

export default AddCursoModal;
