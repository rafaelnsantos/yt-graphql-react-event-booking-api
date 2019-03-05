import React from 'react';

const modal = ({ onConfirm, onCancel, cancelText, confirmText }) => (
  <React.Fragment>
    {(onCancel || onConfirm) && (
      <section className="modal__actions">
        {onCancel && (
          <button className="btn" onClick={onCancel}>
            {cancelText || 'Cancel'}
          </button>
        )}
        {onConfirm ? (
          <button className="btn" onClick={onConfirm}>
            {confirmText || 'Confirm'}
          </button>
        ) : (
          confirmText && (
            <button type="submit" className="btn">
              {confirmText || 'Confirm'}
            </button>
          )
        )}
      </section>
    )}
  </React.Fragment>
);

export default modal;
