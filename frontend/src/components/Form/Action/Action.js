import React from 'react';
import { Spinner } from '../../';
const modal = ({ onConfirm, onCancel, cancelText, confirmText, isLoading }) => (
  <React.Fragment>
    {isLoading ? (
      <Spinner />
    ) : (
      (onCancel || onConfirm) && (
        <section className="modal__actions">
          {onCancel && (
            <button className="btn" onClick={onCancel}>
              {cancelText || 'Cancel'}
            </button>
          )}
          {onConfirm && (
            <button type="submit" className="btn" onClick={onConfirm}>
              {confirmText || 'Confirm'}
            </button>
          )}
        </section>
      )
    )}
  </React.Fragment>
);

export default modal;
