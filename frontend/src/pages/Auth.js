import React, { useState, useContext, useRef } from 'react';
import './Auth.css';
import { AuthContext, GraphQLContext, NotificationContext } from '../context';
import { Formik } from 'formik';
import { object, string } from 'yup';
import { Input, Form } from '../components/Form';
import { Error } from '../components';
import ReCAPTCHA from 'react-google-recaptcha';
import { useTranslation } from 'react-i18next';

const AuthPage = props => {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState();
  const { t } = useTranslation();

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
        sendNotification(email + ' ' + t('auth:registered successfully'));
        values.password = '';
        setIsLogin(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
      setRecaptcha();
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
          .required(t('auth:Email is required')),
        password: string()
          .min(3, 'Minimum length is 3')
          .required(t('auth:Password is required')),
        confirmPassword: string().test(
          'passwords-match',
          t('auth:Passwords must match'),
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
            label={t('auth:Email')}
            formikProps={formikProps}
            placeholder={t('auth:Enter your email')}
            type="email"
          />
          <Input
            id="password"
            formikKey="password"
            label={t('auth:Password')}
            placeholder={t('auth:Password')}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            formikProps={formikProps}
            type="password"
          />
          {!isLogin && (
            <Input
              id="confirm-password"
              formikKey="confirmPassword"
              formikProps={formikProps}
              label={t('auth:Confirm Password')}
              placeholder={t('auth:Confirm Password')}
              type="password"
            />
          )}
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
            onChange={handleCaptchaResponseChange}
          />
          <Error message={error} />
          <div className="form-actions">
            <button type="submit" id="submit" disabled={!recaptcha}>
              {t(isLogin ? 'auth:Login' : 'auth:Signup')}
            </button>
            <div onClick={switchModeHandler}>
              {t(
                isLogin
                  ? 'auth:Dont have an account? Register'
                  : 'auth:Already have an account? Login'
              )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default AuthPage;
