import React, { useState } from 'react';
import { Store } from './Store';
import logo from './logo.png';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { css } from '@emotion/core';
import { SyncLoader } from 'react-spinners';
import ScanPage from './components/ScanPage';
import NotFoundComponent from './components/NotFoundComponent';
import LoginPage from './components/LoginPage';
import useLogger from './Utils/useLogger';
import PrivateRoute from './components/PrivateRoute';
import PaymentPage from './components/PaymentPage/paymentPage';
import ItemsList from './ItemsList';
import WaitingPage from './components/WaitingPage';
import { Dialog, DialogTitle } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Swal from 'sweetalert2';

const override = css`
  display: block;
  margin: 30px auto;
  background: 'transparent';
  backgroundcolor: 'transparent';
`;

const styles = {
  dialogPaper: {
    direction: 'rtl',
    // minHeight: '80vh',
    // maxHeight: '80vh',
  },
};

const App = props => {
  const { state, dispatch } = React.useContext(Store);
  const { errorMessage } = state;

  useLogger('App');

  React.useEffect(() => {
    state.errorMessage &&
      Swal.fire({
        title: 'אופס..',
        text: state.errorMessage,
        type: 'error',
        customClass: {
          icon: 'swal2-arabic-question-mark',
        },
        confirmButtonText: 'אוקי',
      });
  }, [state.errorMessage]);

  return (
    <React.Fragment>
      <Router>
        <div className="App">
          <img src={logo} className="App-logo" alt="Spleat Logo" />
          <div className="sweet-loading" style={{ margin: 20 }}>
            <Dialog
              classes={{ paper: props.classes.dialogPaper }}
              open={state.loading}
            >
              <DialogTitle>{state.loadingMessage}</DialogTitle>
              <SyncLoader
                css={override}
                sizeUnit={'px'}
                size={8}
                color="#4197ED"
                loading={state.loading}
              />
            </Dialog>
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
              <PrivateRoute path="/payment" component={PaymentPage} />
              <PrivateRoute path="/waiting" component={WaitingPage} />
              <Route component={NotFoundComponent} />
            </Switch>
          }
        </div>
      </Router>
    </React.Fragment>
  );
};

export default withStyles(styles)(App);

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
