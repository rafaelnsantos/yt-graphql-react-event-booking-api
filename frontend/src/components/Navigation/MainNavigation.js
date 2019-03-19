import React, { useState } from 'react';
import Menu from './Menu';
import SideDrawer from './SideDrawer/SideDrawer';
import './MainNavigation.css';
import DrawerToggleButton from './SideDrawer/DrawerToggleButton';

const mainNavigation = props => {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const backdropClickHandler = () => {
    setSideDrawerOpen(false);
  };

  const drawerToggleClickHandler = () => {
    setSideDrawerOpen(!sideDrawerOpen);
  };

  return (
    <React.Fragment>
      <header className="main-navigation">
        <div className="main-navigation__toggle-button">
          <DrawerToggleButton click={drawerToggleClickHandler} />
        </div>
        <div className="main-navigation__logo">EasyEvent</div>
        {!sideDrawerOpen && (
          <nav className="main-navigation__items">
            <Menu />
          </nav>
        )}
      </header>
      <SideDrawer backdropClick={backdropClickHandler} show={sideDrawerOpen} />
    </React.Fragment>
  );
};

export default mainNavigation;
