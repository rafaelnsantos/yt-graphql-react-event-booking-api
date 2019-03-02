import React from 'react';
import Backdrop from '../Backdrop/Backdrop';
import './Modal.css';

const modal = ({
  title,
  children,
  onConfirm,
  onCancel,
  cancelText,
  confirmText
}) => (
  <React.Fragment>
    <Backdrop />
    <div className="modal">
      <header className="modal__header">
        <h1>{title}</h1>
      </header>
      <section className="modal__content">{children}</section>
      {(onCancel || onConfirm) && (
        <section className="modal__actions">
          {onCancel && (
            <button className="btn" onClick={onCancel}>
              {cancelText || 'Cancel'}
            </button>
          )}
          {onConfirm && (
            <button className="btn" onClick={onConfirm}>
              {confirmText || 'Confirm'}
            </button>
          )}
        </section>
      )}
    </div>
  </React.Fragment>
);

export default modal;
