import React, { useContext } from 'react';

import { GraphQLContext, AuthContext } from '../context';

const GraphQLProvider = ({ url, children }) => {
  const { token } = useContext(AuthContext);

  const query = async request => {
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: 'Bearer ' + token })
        }
      });

      const { errors, data } = await res.json();

      if (errors) {
        throw new Error(errors[0].message);
      }
      return data;
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  return (
    <GraphQLContext.Provider
      value={{
        query: query
      }}
    >
      {children}
    </GraphQLContext.Provider>
  );
};

export default GraphQLProvider;
