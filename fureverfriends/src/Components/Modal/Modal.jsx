import React from 'react'
import './Modal.css'

const Modal = ({message, onClose}) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <p>{message}</p>
        <button onClick={onClose} className='close-button'>Close</button>
      </div>
    </div>
  );

};

export default Modal;
