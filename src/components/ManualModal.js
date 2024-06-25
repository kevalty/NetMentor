import React, { useState } from 'react';
import Modal from 'react-modal';
import ManualAntesDeInicio from './ManualAntesDeInicio';
import './ManualModal.css';

const ManualModal = () => {
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
        <ManualAntesDeInicio />
      </Modal>
    </div>
  );
};

export default ManualModal;
