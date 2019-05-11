import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Store } from '../../Store';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { state, dispatch } = React.useContext(Store);

  return (
    <Route
      {...rest}
      exact={rest.exact}
      render={props =>
        state.userLoggedIn ? (
          <Component {...props} />
        ) : (
            props.history.push('/login')
          )
      }
    />
  );
};

export default PrivateRoute;
