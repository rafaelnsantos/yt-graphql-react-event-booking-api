import React from 'react';
import './FieldWrapper.css';

const FieldWrapper = ({ children, label, formikProps, formikKey }) => (
  <div className="form-control">
    <label htmlFor={formikKey}>{label}</label>
    {children}
    {formikProps.errors[formikKey] && formikProps.touched[formikKey] && (
      <div className="input-feedback">{formikProps.errors[formikKey]}</div>
    )}
  </div>
);

export default FieldWrapper;
