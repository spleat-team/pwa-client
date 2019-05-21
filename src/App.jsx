import React, { useState } from 'react';
import { Store } from './Store';
import 'react-image-crop/dist/ReactCrop.css';
import logo from './logo.png';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import { css } from '@emotion/core';
import { SyncLoader } from 'react-spinners';
import ScanPage from './components/ScanPage';
import NotFoundComponent from './components/NotFoundComponent';
import LoginPage from './components/LoginPage';
import usePrevious from './Utils/usePrevious';
import useLogger from './Utils/useLogger';
import AuthManager from './components/AuthManager';
import PrivateRoute from './components/PrivateRoute';
import PaymentPage from './components/PaymentPage/paymentPage';
import ItemsList from './ItemsList';
import WaitingPage from './components/WaitingPage';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const App = props => {
  const { state, dispatch } = React.useContext(Store);

  useLogger('App');

  return (
    <React.Fragment>
      <Router>
        <div className="App">
          <img src={logo} className="App-logo" alt="Spleat Logo" />
          <div className="sweet-loading" style={{ margin: 20 }}>
            <SyncLoader
              css={override}
              sizeUnit={'px'}
              size={8}
              color={'#123abc'}
              loading={state.loading}
            />
          </div>
          {
            <Switch>
              <PrivateRoute exact path="/" component={ScanPage} />
              <PrivateRoute
                exact
                path="/itemsList/:groupId?"
                component={ItemsList}
              />
              <Route path="/login" component={LoginPage} />
              <Route
                path="/logout"
                render={() => {
                  return <LoginPage isLogOut={true} />;
                }}
              />
              <Route path="/payment" component={PaymentPage} />
              <Route path="/waiting" component={WaitingPage} />
              {/*<Route path="" component={} />*/}
              <Route component={NotFoundComponent} />
            </Switch>
          }
        </div>
      </Router>
    </React.Fragment>
  );
};

export default App;

// const previousValues = usePrevious({ state, isSignedIn });

// useEffect(() => {
//   if (previousValues && previousValues.state) {
//     if (JSON.stringify(previousValues.state) != JSON.stringify(state)) {
//       console.log('state changed :', previousValues.state, state);
//       if (
//         previousValues.shouldAuthenticate &&
//         previousValues.shouldAuthenticate != shouldAuthenticate
//       ) {
//         console.log(
//           'shouldAuthenticate changed :',
//           previousValues.shouldAuthenticate,
//           shouldAuthenticate
//         );
//       }
//     }
//   }
// });

// useEffect(() => {
//   if (!state.userLoggedIn && shouldAuthenticate) {
//     if (!window.location.href.includes('/login')) {
//       console.log('going to /login...');
//       setShouldAuthenticate(true);
//     } else {
//       console.log('already in /login...');
//     }
//   } else {
//     console.log('user is already logged in...');
//   }
// }, [shouldAuthenticate, state.userLoggedIn]);
