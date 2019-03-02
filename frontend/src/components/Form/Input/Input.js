import React from 'react';
import './Input.css';
import FieldWrapper from '../FieldWrapper';

const Input = ({ label, formikProps, formikKey, ...rest }) => {
  return (
    <FieldWrapper label={label} formikKey={formikKey} formikProps={formikProps}>
      <input
        onChange={formikProps.handleChange(formikKey)}
        onBlur={formikProps.handleBlur(formikKey)}
        value={formikProps.values[formikKey]}
        className={
          formikProps.errors[formikKey] &&
          formikProps.touched[formikKey] &&
          'error'
        }
        {...rest}
      />
    </FieldWrapper>
  );
};

export default Input;
