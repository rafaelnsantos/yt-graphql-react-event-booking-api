import React from 'react';
import { Spinner } from './';
const Fragment = ({ isLoading, children }) => {
  return <React.Fragment>{isLoading ? <Spinner /> : children}</React.Fragment>;
};

export default Fragment;
