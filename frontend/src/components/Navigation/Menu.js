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

  const LanguageButton = ({ language, children }) =>
    i18n.language !== language && (
      <button onClick={() => i18n.changeLanguage(language)}>{children}</button>
    );

  return (
    <ul>
      <LanguageButton language="en-US">us</LanguageButton>
      <LanguageButton language="pt-BR">pt</LanguageButton>
      <LanguageButton language="es-ES">es</LanguageButton>

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
