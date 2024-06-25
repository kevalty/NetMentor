import React, { useState, useEffect } from 'react';

function EditQuestionModal({ showModal, onCloseModal, onSubmit, question }) {
  const [editedQuestionData, setEditedQuestionData] = useState({
    name: '',
    type: 'single-choice',
    choices: {
      a: '',
      b: '',
      c: '',
      d: ''
    },
    correct_indexes: [],
    explication: '',
    drag_options: []
  });

  useEffect(() => {
    if (question) {
      setEditedQuestionData({
        name: question.attributes.name,
        type: question.attributes.type,
        choices: { ...question.attributes.choices },
        correct_indexes: question.attributes.correct_indexes || [],
        explication: question.attributes.explication,
        drag_options: question.attributes.drag_options || []
      });
    }
  }, [question]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedQuestionData({ ...editedQuestionData, [name]: value });
  };

  const handleChoiceChange = (e, choice) => {
    const { value } = e.target;
    setEditedQuestionData({
      ...editedQuestionData,
      choices: { ...editedQuestionData.choices, [choice]: value }
    });
  };

  const handleCorrectIndexesChange = (e) => {
    const { options } = e.target;
    const selectedValues = [];
    for (const option of options) {
      if (option.selected) {
        selectedValues.push(option.value);
      }
    }
    setEditedQuestionData({ ...editedQuestionData, correct_indexes: selectedValues });
  };

  const handleDragOptionsChange = (e, index) => {
    const { value } = e.target;
    const newDragOptions = [...editedQuestionData.drag_options];
    newDragOptions[index] = value;
    setEditedQuestionData({ ...editedQuestionData, drag_options: newDragOptions });
  };

  const handleAddDragOption = () => {
    setEditedQuestionData({ ...editedQuestionData, drag_options: [...editedQuestionData.drag_options, ''] });
  };

  const handleSubmit = () => {
    onSubmit(editedQuestionData);
  };

  return (
    <div className={`modal ${showModal ? 'show' : ''}`}>
      <div className="modal-content">
        <span className="close" onClick={onCloseModal}>&times;</span>
        <h2>Editar Pregunta</h2>
        <form>
          <label htmlFor="name">Pregunta:</label>
          <input type="text" id="name" name="name" value={editedQuestionData.name} onChange={handleChange} />
          
          <label htmlFor="type">Tipo de Pregunta:</label>
          <select id="type" name="type" value={editedQuestionData.type} onChange={handleChange}>
            <option value="single-choice">Selección Única</option>
            <option value="multiple-choice">Selección Múltiple</option>
            <option value="drag-and-drop">Arrastrar para Completar</option>
          </select>
          
          <label>Respuestas:</label>
          <input type="text" name="a" value={editedQuestionData.choices.a} onChange={(e) => handleChoiceChange(e, 'a')} />
          <input type="text" name="b" value={editedQuestionData.choices.b} onChange={(e) => handleChoiceChange(e, 'b')} />
          <input type="text" name="c" value={editedQuestionData.choices.c} onChange={(e) => handleChoiceChange(e, 'c')} />
          <input type="text" name="d" value={editedQuestionData.choices.d} onChange={(e) => handleChoiceChange(e, 'd')} />
          
          {editedQuestionData.type === 'multiple-choice' && (
            <>
              <label htmlFor="correct_indexes">Índices de Respuestas Correctas:</label>
              <select multiple={true} id="correct_indexes" name="correct_indexes" value={editedQuestionData.correct_indexes} onChange={handleCorrectIndexesChange}>
                <option value="0">a</option>
                <option value="1">b</option>
                <option value="2">c</option>
                <option value="3">d</option>
              </select>
            </>
          )}
          
          {editedQuestionData.type === 'drag-and-drop' && (
            <>
              <label>Opciones de Arrastre:</label>
              {editedQuestionData.drag_options.map((option, index) => (
                <input key={index} type="text" value={option} onChange={(e) => handleDragOptionsChange(e, index)} />
              ))}
              <button type="button" onClick={handleAddDragOption}>Añadir Opción de Arrastre</button>
            </>
          )}
          
          <label htmlFor="explication">Explicación:</label>
          <input type="text" id="explication" name="explication" value={editedQuestionData.explication} onChange={handleChange} />
          <button type="button" onClick={handleSubmit}>Editar</button>
        </form>
      </div>
    </div>
  );
}

export default EditQuestionModal;
