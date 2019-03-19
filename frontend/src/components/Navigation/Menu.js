import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';

const LiNavLink = ({ children, to }) => (
  <li>
    <NavLink to={to}>{children}</NavLink>
  </li>
);

const Menu = props => {
  const { token, logout } = useContext(AuthContext);
  return (
    <ul>
      {!token && <LiNavLink to="/auth">Authenticate</LiNavLink>}
      <LiNavLink to="/events">Events</LiNavLink>
      {token && (
        <React.Fragment>
          <LiNavLink to="/bookings">Bookings</LiNavLink>
          <li>
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
