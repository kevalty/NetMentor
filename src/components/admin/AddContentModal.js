import React, { useState } from 'react';

function AddContentModal({ onCloseModal, onSubmit }) {
  const [name, setName] = useState('');
  const [materialUrl, setMaterialUrl] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const handleSubmit = () => {
    onSubmit({ name, material_url: materialUrl, video_url: videoUrl });
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Agregar Contenido</h3>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL de Material"
          value={materialUrl}
          onChange={(e) => setMaterialUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="URL de Video"
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
        />
        <button onClick={handleSubmit}>Guardar</button>
        <button onClick={onCloseModal}>Cancelar</button>
      </div>
    </div>
  );
}

export default AddContentModal;
