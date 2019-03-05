import React from 'react';
import { Form } from 'formik';
import { Fragment } from '../';

const FormFragment = ({ children, isLoading, ...rest }) => {
  return (
    <Fragment isLoading={isLoading}>
      <Form {...rest}>{children}</Form>
    </Fragment>
  );
};

export default FormFragment;
