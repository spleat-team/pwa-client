import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { Store } from '../../Store';

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { state } = React.useContext(Store);

  return (
    <Route
      {...rest}
      exact={rest.exact}
      render={props =>
        state.userLoggedIn ? (

            // When the page is loaded at the first time:
            // If the user arrive to this page from the regular flow - show it, if he enter a url - redirect to home page
            (props.history.action != 'PUSH' &&
                (props.match.url == '/payment' ||
                props.match.url == '/waiting' ||
                props.match.url == '/itemsList')) ?
                <Redirect to={{pathname: '/'}}/> :
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
  );
};

export default PrivateRoute;
