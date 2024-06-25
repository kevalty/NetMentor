import React from 'react';

function DeleteContentModal({ onCancel, onConfirm }) {
  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Confirmar Eliminación</h2>
        <p>¿Estás seguro de que deseas eliminar este contenido?</p>
        <div className="modal-actions">
          <button onClick={onCancel}>Cancelar</button>
          <button onClick={onConfirm}>Eliminar</button>
        </div>
      </div>
    </div>
  );
}

export default DeleteContentModal;
