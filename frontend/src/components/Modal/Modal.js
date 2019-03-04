import React from 'react';
import Backdrop from '../Backdrop/Backdrop';
import './Modal.css';
import { Action } from '../Form';
const modal = ({ title, children, ...rest }) => (
  <React.Fragment>
    <Backdrop />
    <div className="modal">
      <header className="modal__header">
        <h1>{title}</h1>
      </header>
      <section className="modal__content">{children}</section>
      <Action {...rest} />
    </div>
  </React.Fragment>
);

export default modal;
