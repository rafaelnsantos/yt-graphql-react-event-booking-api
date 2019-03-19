import React from 'react';
import './SideDrawer.css';
import { Backdrop } from '../../';
import Menu from '../Menu';

const sideDrawer = ({ backdropClick, show }) => (
  <React.Fragment>
    {show && <Backdrop click={backdropClick} />}
    <nav className={show ? 'side-drawer open' : 'side-drawer'}>
      <Menu />
    </nav>
  </React.Fragment>
);
export default sideDrawer;
