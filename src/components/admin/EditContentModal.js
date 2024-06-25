import React, { useState, useEffect } from 'react';

function EditContentModal({ showModal, onCloseModal, onSubmit, content }) {
  const [editedContentData, setEditedContentData] = useState({
    name: '',
    material_url: '',
    video_url: ''
  });

  useEffect(() => {
    if (content) {
      setEditedContentData({
        name: content.attributes.name,
        material_url: content.attributes.material_url,
        video_url: content.attributes.video_url
      });
    }
  }, [content]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedContentData({ ...editedContentData, [name]: value });
  };

  const handleSubmit = () => {
    onSubmit(editedContentData);
  };

  const handleCancel = () => {
    onCloseModal();
  };

  return (
    <div className={`modal ${showModal ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onCloseModal}>&times;</span>
        <h2>Editar Contenido</h2>
        <form>
          <label htmlFor="name">Nombre:</label>
          <input type="text" id="name" name="name" value={editedContentData.name} onChange={handleChange} />
          <label htmlFor="material_url">URL de Material:</label>
          <input type="text" id="material_url" name="material_url" value={editedContentData.material_url} onChange={handleChange} />
          <label htmlFor="video_url">URL de Video:</label>
          <input type="text" id="video_url" name="video_url" value={editedContentData.video_url} onChange={handleChange} />
          <div className="modal-buttons">
            <button type="button" onClick={handleSubmit}>Guardar</button>
            <button type="button" onClick={handleCancel}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditContentModal;
