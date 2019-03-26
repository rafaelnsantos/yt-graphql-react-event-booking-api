import React, { useState, useContext, useRef } from 'react';
import './Auth.css';
import { AuthContext, GraphQLContext, NotificationContext } from '../context';
import { Formik } from 'formik';
import { object, string } from 'yup';
import { Input, Form } from '../components/Form';
import { Error } from '../components';
import ReCAPTCHA from 'react-google-recaptcha';

const AuthPage = props => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState();

  const { login, setRecaptcha, recaptcha } = useContext(AuthContext);
  const { query, mutate } = useContext(GraphQLContext);
  const { sendNotification } = useContext(NotificationContext);
  const recaptchaRef = useRef();

  const switchModeHandler = () => {
    setIsLogin(!isLogin);
    setError();
    recaptchaRef.current.reset();
    setRecaptcha();
  };

  const submitHandler = async (values, { setSubmitting }) => {
    setError();
    const loginQuery = `
      query ($email: Email!, $password: String!) {
        login(email: $email, password: $password) {
          userId
          token
          tokenExpiration
        }
      }
    `;
    const createMutation = `
      mutation ($email: Email!, $password: String!) {
        createUser(email: $email, password: $password) {
          _id
          email
        }
      }
    `;

    try {
      if (isLogin) {
        const data = await query({ query: loginQuery, variables: values });
        const { token, userId, tokenExpiration } = data.login;
        login(token, userId, tokenExpiration);
      } else {
        const data = await mutate({
          mutation: createMutation,
          variables: values
        });
        const { email } = data.createUser;
        sendNotification(`${email} registered successfully`);
        values.password = '';
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCaptchaResponseChange = token => {
    setRecaptcha(token);
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
            id="email"
            formikKey="email"
            label="Email"
            formikProps={formikProps}
            placeholder="Enter your email"
            type="email"
          />
          <Input
            id="password"
            formikKey="password"
            label="Password"
            placeholder="Password"
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            formikProps={formikProps}
            type="password"
          />
          {!isLogin && (
            <Input
              id="confirm-password"
              formikKey="confirmPassword"
              formikProps={formikProps}
              label="Confirm Password"
              placeholder="Confirm Password"
              type="password"
            />
          )}
          <Error message={error} />
          <div className="form-actions">
            <button type="submit" id="submit" disabled={!recaptcha}>
              {isLogin ? 'Login' : 'Signup'}
            </button>
            <button type="button" onClick={switchModeHandler}>
              Switch to {isLogin ? 'Signup' : 'Login'}
            </button>
          </div>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaResponseChange}
          />
        </Form>
      )}
    </Formik>
  );
};

export default AuthPage;
