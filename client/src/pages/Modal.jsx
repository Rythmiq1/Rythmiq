// src/components/Modal.jsx

import React from 'react';
// import './Modal.css'; // You can style your modal in this CSS file

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button className="modal-close" onClick={onClose}>
                    &times; {/* Close button */}
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
