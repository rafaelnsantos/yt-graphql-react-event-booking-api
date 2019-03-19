import React from 'react';
import Backdrop from '../Backdrop/Backdrop';
import './Modal.css';
import { Fragment } from '../';
import { Action } from '../Form';
const modal = ({ title, children, isLoading, ...rest }) => (
  <React.Fragment>
    <Backdrop click={rest.onCancel} />
    <div className="modal">
      <header className="modal__header">
        <h1>{title}</h1>
      </header>
      <Fragment isLoading={isLoading}>
        <section className="modal__content">{children}</section>
        <Action {...rest} />
      </Fragment>
    </div>
  </React.Fragment>
);

export default modal;
