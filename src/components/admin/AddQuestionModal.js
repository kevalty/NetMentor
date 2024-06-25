import React, { useState } from 'react';
import './AddQuestionModal.css';

function AddQuestionModal({ showModal, onCloseModal, onSubmit }) {
  const [questionData, setQuestionData] = useState({
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
    drag_options: [],
    text_initial: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData({ ...questionData, [name]: value });
  };

  const handleChoiceChange = (e, choice) => {
    const { value } = e.target;
    setQuestionData({
      ...questionData,
      choices: { ...questionData.choices, [choice]: value }
    });
  };

  const handleCorrectIndexesChange = (e) => {
    const { value, checked } = e.target;
    let newCorrectIndexes = [...questionData.correct_indexes];
    if (checked) {
      newCorrectIndexes.push(Number(value));
    } else {
      newCorrectIndexes = newCorrectIndexes.filter(index => index !== Number(value));
    }
    setQuestionData({ ...questionData, correct_indexes: newCorrectIndexes });
  };

  const handleDragOptionsChange = (e, index, field) => {
    const { value } = e.target;
    const newDragOptions = [...questionData.drag_options];
    newDragOptions[index] = { ...newDragOptions[index], [field]: value };
    setQuestionData({ ...questionData, drag_options: newDragOptions });
  };

  const handleAddDragOption = () => {
    setQuestionData({ 
      ...questionData, 
      drag_options: [...questionData.drag_options, { id: questionData.drag_options.length + 1, option: '', text_final: '', order: questionData.drag_options.length }]
    });
  };

  const handleSubmit = () => {
    const submitData = {
      ...questionData,
      drag_options: questionData.drag_options.map((option, index) => ({
        ...option,
        text_initial: index === 0 ? questionData.text_initial : ''
      }))
    };
    onSubmit(submitData);
  };

  return (
    <div className={`add-question-modal ${showModal ? 'show' : ''}`}>
      <div className="add-question-modal-content">
        <span className="add-question-modal-close" onClick={onCloseModal}>&times;</span>
        <h2>Agregar Pregunta</h2>
        <form>
          <label htmlFor="type">Tipo de Pregunta:</label>
          <select id="type" name="type" value={questionData.type} onChange={handleChange}>
            <option value="single-choice">Selección Única</option>
            <option value="multiple-choice">Selección Múltiple</option>
            <option value="drag-and-drop">Arrastrar para Completar</option>
          </select>
          
          <label htmlFor="name">Pregunta:</label>
          <input type="text" id="name" name="name" value={questionData.name} onChange={handleChange} />
          
          {['single-choice', 'multiple-choice'].includes(questionData.type) && (
            <>
              <label>Respuestas:</label>
              <input type="text" name="a" value={questionData.choices.a} onChange={(e) => handleChoiceChange(e, 'a')} />
              <input type="text" name="b" value={questionData.choices.b} onChange={(e) => handleChoiceChange(e, 'b')} />
              <input type="text" name="c" value={questionData.choices.c} onChange={(e) => handleChoiceChange(e, 'c')} />
              <input type="text" name="d" value={questionData.choices.d} onChange={(e) => handleChoiceChange(e, 'd')} />
            </>
          )}

          {questionData.type === 'single-choice' && (
            <>
              <label htmlFor="correct_indexes">Índice de Respuesta Correcta:</label>
              <select id="correct_indexes" name="correct_indexes" value={questionData.correct_indexes[0]} onChange={(e) => setQuestionData({ ...questionData, correct_indexes: [Number(e.target.value)] })}>
                <option value="0">a</option>
                <option value="1">b</option>
                <option value="2">c</option>
                <option value="3">d</option>
              </select>
            </>
          )}

          {questionData.type === 'multiple-choice' && (
            <>
              <label>Selecciona las respuestas correctas:</label>
              <div className="add-question-modal-correct-options-container">
                {['a', 'b', 'c', 'd'].map((choice, index) => (
                  <div key={index} className={`add-question-modal-correct-option ${questionData.correct_indexes.includes(index) ? 'selected' : ''}`}>
                    <label htmlFor={`correct_${choice}`}>{choice}</label>
                    <input type="checkbox" id={`correct_${choice}`} value={index} onChange={handleCorrectIndexesChange} checked={questionData.correct_indexes.includes(index)} />
                  </div>
                ))}
              </div>
            </>
          )}

          {questionData.type === 'drag-and-drop' && (
            <>
              <label htmlFor="text_initial">Texto Inicial:</label>
              <input type="text" id="text_initial" name="text_initial" value={questionData.text_initial} onChange={handleChange} />

              {questionData.drag_options.map((option, index) => (
                <div key={index} className="add-question-modal-drag-option">
                  <label>Opción {index + 1}:</label>
                  <input type="text" value={option.option} onChange={(e) => handleDragOptionsChange(e, index, 'option')} />
                  <label>Texto Final:</label>
                  <input type="text" value={option.text_final} onChange={(e) => handleDragOptionsChange(e, index, 'text_final')} />
                </div>
              ))}
              <button type="button" onClick={handleAddDragOption}>Añadir Opción de Arrastre</button>
            </>
          )}
          
          <label htmlFor="explication">Explicación:</label>
          <input type="text" id="explication" name="explication" value={questionData.explication} onChange={handleChange} />

          <button type="button" onClick={handleSubmit}>Agregar</button>
        </form>
      </div>
    </div>
  );
}

export default AddQuestionModal;
