import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/auth-context';
import { useTranslation } from 'react-i18next';

const Menu = ({ close }) => {
  const { token, logout } = useContext(AuthContext);
  const { t, i18n } = useTranslation();

  const LiNavLink = ({ children, to }) => (
    <li onClick={close}>
      <NavLink to={to}>{children}</NavLink>
    </li>
  );

  return (
    <ul>
      {i18n.language === 'en-US' ? (
        <button onClick={() => i18n.changeLanguage('pt-BR')}>pt</button>
      ) : (
        <button onClick={() => i18n.changeLanguage('en-US')}>en</button>
      )}
      {!token && (
        <LiNavLink to="/auth">{t('navigation:Authenticate')}</LiNavLink>
      )}
      <LiNavLink to="/events">{t('navigation:Events')}</LiNavLink>
      {token && (
        <React.Fragment>
          <LiNavLink to="/bookings">{t('navigation:Bookings')}</LiNavLink>
          <li onClick={close}>
            <button id="logout" onClick={logout}>
              {t('navigation:Logout')}
            </button>
          </li>
        </React.Fragment>
      )}
    </ul>
  );
};

export default Menu;
