import React, { useContext } from 'react';

import GraphQLContext from '../context/graphql-context';
import AuthContext from '../context/auth-context';

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
      if (res.status !== 200 && res.status !== 201) {
        throw new Error('Failed!');
      }
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
