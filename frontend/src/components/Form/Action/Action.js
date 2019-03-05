import React from 'react';
import { Error } from '../..';

const modal = ({ onConfirm, onCancel, cancelText, confirmText, error }) => (
  <React.Fragment>
    <Error message={error} />
    {(onCancel || onConfirm) && (
      <section className="modal__actions">
        {onCancel && (
          <button type="button" className="btn" onClick={onCancel}>
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
