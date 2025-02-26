import React from 'react';
import './Modal.css'


 const Modal = ({isOpen, message, type, onClose}) => {
    if(!isOpen) return null;
  return (
    <div className="modal-overlay">
        <div className="modal-content">
            <div className="modal-header">
                <span className='close' onClick={onClose}>&times;</span>
            </div>
            <div className="modal-body">
                <div className={`modal-icon ${type === 'success' ? 'success' : 'error'}`} >
                    {type === 'success' ? '✔' : '✘'}
                </div>
                <p>{message}</p>
            </div>
        </div>
    </div>
  );
};

export default Modal;
