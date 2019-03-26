import React, { useState } from 'react';

import { AuthContext } from '../context';

const AuthProvider = props => {
  const [token, setToken] = useState(localStorage.getItem('token', null));
  const [userId, setUserId] = useState(localStorage.getItem('userId', null));
  const [recaptcha, setRecaptcha] = useState();

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setUserId(userId);
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
  };

  const logout = () => {
    setToken(null);
    setUserId(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider
      value={{
        token: token,
        userId: userId,
        login: login,
        logout: logout,
        recaptcha,
        setRecaptcha
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
