import React, { useState } from 'react';

import AuthContext from '../context/auth-context';

const AuthProvider = props => {
  const [token, setToken] = useState(localStorage.getItem('token', null));
  const [userId, setUserId] = useState(localStorage.getItem('userId', null));

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
        logout: logout
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
