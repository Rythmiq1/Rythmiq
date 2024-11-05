// src/components/Modal.jsx

import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    &times; 
                </button>
                {children}
            </div>
        </div>
    );
};

<<<<<<< HEAD
export default Modal;
=======
export default Modal;
>>>>>>> origin/main
