import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { Store } from '../../Store';

const PrivateRoute = ({ component, ...rest }) => {
  const { state, dispatch } = React.useContext(Store);

  return (
    <Router>
      <Route
        exact={rest.exact}
        {...rest}
        render={props => {
          console.log('tried to get to a private route from : ', props);
          return state.userLoggedIn ? (
            <component {...props} />
          ) : (
              <div>
                {props.history.push('/login')}
                <p>DAMMM</p>
              </div>
              // <Redirect
              //   to={{
              //     pathname: '/login',
              //     state: { from: props.location },
              //   }}
              // />
            );
        }}
      />
    </Router>
  );
};

export default PrivateRoute;
