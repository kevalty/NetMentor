import React, { useState, useEffect } from 'react';

function EditModal({ isOpen, onCloseModal, onSave, introductionData }) {
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (introductionData) {
      setNewName(introductionData.name);
    }
  }, [introductionData]);

  const handleChange = (e) => {
    setNewName(e.target.value);
  };

  const handleSubmit = () => {
    onSave(newName);
    onCloseModal(); // Cerrar el modal después de guardar
  };

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onCloseModal}>&times;</span>
        <h2>Editar Introducción</h2>
        <form>
          <label htmlFor="name">Nombre:</label>
          <input type="text" id="name" name="name" value={newName} onChange={handleChange} />
          <button type="button" onClick={handleSubmit}>Guardar</button>
        </form>
      </div>
    </div>
  );
}

export default EditModal;
