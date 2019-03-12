import React from 'react';

export default React.createContext({
  query: ({ query, variables }) => {},
  mutate: ({ mutation, variables }) => {},
  subscribe: ({ subscription, callback }) => {}
});
