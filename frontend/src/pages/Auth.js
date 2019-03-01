import React, { useState, useContext, useRef } from 'react';
import './Auth.css';
import AuthContext from '../context/auth-context';
import GraphQLContext from '../context/graphql-context';

const AuthPage = props => {
  const [isLogin, setIsLogin] = useState(true);

  const { login } = useContext(AuthContext);
  const { query } = useContext(GraphQLContext);

  const emailEl = useRef();
  const passwordEl = useRef();

  const switchModeHandler = () => {
    setIsLogin(!isLogin);
  };

  const submitHandler = async event => {
    event.preventDefault();
    const email = emailEl.current.value;
    const password = passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email,
        password: password
      }
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!) {
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
            }
          }
        `,
        variables: {
          email: email,
          password: password
        }
      };
    }
    try {
      const data = await query(requestBody);
      login(data.login.token, data.login.userId, data.login.tokenExpiration);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form className="auth-form" onSubmit={submitHandler}>
      <div className="form-control">
        <label htmlFor="email">E-Mail</label>
        <input type="email" id="email" ref={emailEl} />
      </div>
      <div className="form-control">
        <label htmlFor="password">Password</label>
        <input type="password" id="password" ref={passwordEl} />
      </div>
      <div className="form-actions">
        <button type="submit">Submit</button>
        <button type="button" onClick={switchModeHandler}>
          Switch to {isLogin ? 'Signup' : 'Login'}
        </button>
      </div>
    </form>
  );
};

export default AuthPage;
