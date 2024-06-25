import React, { useState } from 'react';

function CreateIntroModal({ isOpen, onCloseModal, onSave, contentId }) {
  const [newIntroName, setNewIntroName] = useState('');

  const handleChange = (e) => {
    setNewIntroName(e.target.value);
  };

  const handleSubmit = () => {
    onSave(newIntroName, contentId);
    onCloseModal(); // Cerrar el modal después de guardar
  };

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onCloseModal}>&times;</span>
        <h2>Crear Nueva Introducción</h2>
        <form>
          <label htmlFor="newIntroName">Nombre:</label>
          <input type="text" id="newIntroName" name="newIntroName" value={newIntroName} onChange={handleChange} />
          <button type="button" onClick={handleSubmit}>Guardar</button>
        </form>
      </div>
    </div>
  );
}

export default CreateIntroModal;
