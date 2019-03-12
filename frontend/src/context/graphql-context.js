import React from 'react';

export default React.createContext({
  query: options => {},
  mutate: options => {},
  subscribe: ({ subscription, callback }) => {}
});
