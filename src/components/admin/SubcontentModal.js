import React, { useState, useEffect } from 'react';

function SubcontentModal({ onCloseModal, onSubmit, subcontent }) {
  const [formData, setFormData] = useState({
    name: '',
    material_url: '',
    video_url: '',
    juego_url: '',
    refuerzo_url: '',
  });

  useEffect(() => {
    if (subcontent) {
      setFormData({
        name: subcontent.attributes.name || '',
        material_url: subcontent.attributes.material_url || '',
        video_url: subcontent.attributes.video_url || '',
        juego_url: subcontent.attributes.juego_url || '',
        refuerzo_url: subcontent.attributes.refuerzo_url || '',
      });
    }
  }, [subcontent]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-btn" onClick={onCloseModal}>&times;</span>
        <h2>{subcontent ? 'Editar Subcontenido' : 'Agregar Subcontenido'}</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            URL del Material:
            <input
              type="text"
              name="material_url"
              value={formData.material_url}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            URL del Video:
            <input
              type="text"
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            URL del Juego:
            <input
              type="text"
              name="juego_url"
              value={formData.juego_url}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            URL del Refuerzo:
            <input
              type="text"
              name="refuerzo_url"
              value={formData.refuerzo_url}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">{subcontent ? 'Guardar Cambios' : 'Agregar Subcontenido'}</button>
        </form>
      </div>
    </div>
  );
}

export default SubcontentModal;
