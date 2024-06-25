import React, { useState } from 'react';

const QuestionModal = ({ isOpen, handleClose, handleSubmit, questionData, handleChange }) => {
  const [editedQuestionData, setEditedQuestionData] = useState(questionData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedQuestionData({ ...editedQuestionData, [name]: value });
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    handleSubmit(editedQuestionData);
  };

  return (
    isOpen && (
      <div className="modal">
        <div className="modal-content">
          <span className="close-btn" onClick={handleClose}>&times;</span>
          <h2>Editar Pregunta</h2>
          <form onSubmit={handleSubmitEdit}>
            <label htmlFor="name">Pregunta:</label>
            <input type="text" id="name" name="name" value={editedQuestionData.name} onChange={handleInputChange} required />
            <label htmlFor="type">Tipo de Pregunta:</label>
            <select id="type" name="type" value={editedQuestionData.type} onChange={handleInputChange} required>
              <option value="single-choice">Selección Única</option>
              <option value="multiple-choice">Selección Múltiple</option>
              <option value="drag-and-drop">Arrastrar para Completar</option>
            </select>
            <label htmlFor="choices">Opciones (separadas por comas):</label>
            <input type="text" id="choices" name="choices" value={editedQuestionData.choices.join(', ')} onChange={handleInputChange} required />
            {editedQuestionData.type !== 'drag-and-drop' && (
              <>
                <label htmlFor="correct_indexes">Índices Correctos (separados por comas):</label>
                <input type="text" id="correct_indexes" name="correct_indexes" value={editedQuestionData.correct_indexes.join(', ')} onChange={handleInputChange} required />
              </>
            )}
            {editedQuestionData.type === 'drag-and-drop' && (
              <>
                <label htmlFor="drag_options">Opciones de Arrastre (separadas por comas):</label>
                <input type="text" id="drag_options" name="drag_options" value={editedQuestionData.drag_options.join(', ')} onChange={handleInputChange} required />
              </>
            )}
            <label htmlFor="explication">Explicación:</label>
            <input type="text" id="explication" name="explication" value={editedQuestionData.explication} onChange={handleInputChange} required />
            <div>
              <button type="submit">Guardar cambios</button>
              <button type="button" className="cancel-btn" onClick={handleClose}>Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default QuestionModal;
