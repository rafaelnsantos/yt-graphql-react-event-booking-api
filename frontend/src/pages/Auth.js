import React, { useState, useContext } from 'react';
import './Auth.css';
import { AuthContext, GraphQLContext } from '../context';
import { Formik } from 'formik';
import { object, string } from 'yup';
import { Input, Form } from '../components/Form';

const AuthPage = props => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState();

  const { login } = useContext(AuthContext);
  const { query } = useContext(GraphQLContext);

  const switchModeHandler = () => {
    setIsLogin(!isLogin);
    setError();
  };

  const submitHandler = async (values, { setSubmitting }) => {
    setError();
    let requestBody = {
      query: `
        query Login($email: Email!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: values.email,
        password: values.password
      }
    };

    if (!isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email: Email!, $password: String!) {
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
            }
          }
        `,
        variables: {
          email: values.email,
          password: values.password
        }
      };
    }
    try {
      const data = await query(requestBody);
      if (!isLogin) return;
      const { token, userId, tokenExpiration } = data.login;
      login(token, userId, tokenExpiration);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
        confirmPassword: ''
      }}
      onSubmit={submitHandler}
      validationSchema={object().shape({
        email: string()
          .email('Email not valid')
          .required('Email is required'),
        password: string()
          .min(3, 'Minimum length is 3')
          .required('Password is required!'),
        confirmPassword: string().test(
          'passwords-match',
          'Passwords must match',
          function(value) {
            return isLogin || this.parent.password === value;
          }
        )
      })}
    >
      {formikProps => (
        <Form className="auth-form" isLoading={formikProps.isSubmitting}>
          <Input
            formikKey="email"
            label="Email"
            formikProps={formikProps}
            placeholder="Enter your email"
            type="email"
          />
          <Input
            formikKey="password"
            label="Password"
            placeholder="Password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            formikProps={formikProps}
            type="password"
          />
          {!isLogin && (
            <Input
              formikKey="confirmPassword"
              formikProps={formikProps}
              label="Confirm Password"
              placeholder="Confirm Password"
              type="password"
            />
          )}
          <div className="form-actions">
            <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
            <button type="button" onClick={switchModeHandler}>
              Switch to {isLogin ? 'Signup' : 'Login'}
            </button>
          </div>
          {error && <div className="input-feedback">{error}</div>}
        </Form>
      )}
    </Formik>
  );
};

export default AuthPage;
