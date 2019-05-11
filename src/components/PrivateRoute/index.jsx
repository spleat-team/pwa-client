import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter,
} from 'react-router-dom';
import { Store } from '../../Store';

const PrivateRoute = ({ component, ...rest }) => {
  const { state, dispatch } = React.useContext(Store);

  return (
    <Router>
      <Route
        exact
        {...rest}
        render={props => {
          console.log(
            'tried to get to a private route from : ',
            props.location
          );
          return state.userLoggedIn ? (
            <component {...props} />
          ) : (
              <Redirect
                to={{
                  pathname: '/login',
                  state: { from: props.location },
                }}
              />
            );
        }}
      />
    </Router>
  );
};

export default PrivateRoute;
