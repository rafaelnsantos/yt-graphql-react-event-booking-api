import React, { useContext } from 'react';
import { AuthContext } from './context';
import { Route, Redirect, Switch } from 'react-router-dom';

import { AuthPage, BookingsPage, EventsPage } from './pages';

const Routes = props => {
  const { token } = useContext(AuthContext);
  return (
    <Switch>
      {token && <Redirect from="/" to="/events" exact />}
      {token && <Redirect from="/auth" to="/events" exact />}
      {!token && <Route path="/auth" component={AuthPage} />}
      <Route path="/events" component={EventsPage} />
      {token && <Route path="/bookings" component={BookingsPage} />}
      {!token && <Redirect to="/auth" exact />}
    </Switch>
  );
};

export default Routes;
