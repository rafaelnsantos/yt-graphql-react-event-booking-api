import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';

const Menu = ({ close }) => {
  const { token, logout } = useContext(AuthContext);

  const LiNavLink = ({ children, to }) => (
    <li onClick={close}>
      <NavLink to={to}>{children}</NavLink>
    </li>
  );

  return (
    <ul>
      {!token && <LiNavLink to="/auth">Authenticate</LiNavLink>}
      <LiNavLink to="/events">Events</LiNavLink>
      {token && (
        <React.Fragment>
          <LiNavLink to="/bookings">Bookings</LiNavLink>
          <li onClick={close}>
            <button id="logout" onClick={logout}>
              Logout
            </button>
          </li>
        </React.Fragment>
      )}
    </ul>
  );
};

export default Menu;
