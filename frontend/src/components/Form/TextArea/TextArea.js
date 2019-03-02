import React from 'react';
import FieldWrapper from '../FieldWrapper';
import './TextArea.css';

const TextArea = ({ label, formikProps, formikKey, ...rest }) => {
  return (
    <FieldWrapper label={label} formikKey={formikKey} formikProps={formikProps}>
      <textarea
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

export default TextArea;
