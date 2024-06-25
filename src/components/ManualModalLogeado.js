import React, { useState } from 'react';
import Modal from 'react-modal';
import ManualLogeado from './ManualLogeado';
import './ManualModal.css';

Modal.setAppElement('#root'); // Asegura que el modal se maneje correctamente para accesibilidad

const ManualModalLogeado = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => setModalIsOpen(true);
  const closeModal = () => setModalIsOpen(false);

  return (
    <div>
      <button className="help-button" onClick={openModal}>?</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Manual de Usuario"
        className="modal-conten1t"
        overlayClassName="modal-overlay1"
      >
        <button className="close-button" onClick={closeModal}>X</button>
        <ManualLogeado />
      </Modal>
    </div>
  );
};

export default ManualModalLogeado;
