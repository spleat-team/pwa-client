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
          {}
          {console.log('Apppppppppppppppppppp')}
          {
            <Switch>
              <PrivateRoute exact path="/" component={ScanPage} />
              <Route path="/login" component={LoginPage} />
              <Route
                path="/logout"
                render={() => {
                  return <LoginPage isLogOut={true} />;
                }}
              />
              {
                //<Route path="/itemsList" component={itemsList} />
              }
              <Route component={NotFoundComponent} />
            </Switch>
          }
        </div>
      </Router>
    </React.Fragment>
  );
};

export default App;

// import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

// const firebaseConfig = {
//   apiKey: 'AIzaSyA4uCgHWUewD5XHo05GrRNmd5diYaUN9n4',
//   authDomain: 'spleat-4629b.firebaseapp.com',
//   databaseURL: 'https://spleat-4629b.firebaseio.com',
//   projectId: 'spleat-4629b',
//   storageBucket: 'spleat-4629b.appspot.com',
//   messagingSenderId: '761349823555',
//   appId: '1:761349823555:web:ba956c9f71eedae5',
// };

// <StyledFirebaseAuth
//   uiConfig={uiConfig}
//   firebaseAuth={firebase
//     .auth()
//     .setPersistence(firebase.auth.Auth.Persistence.NONE)
//     .then(function () {
//       // Existing and future Auth states are now persisted in the current
//       // session only. Closing the window would clear any existing state even
//       // if a user forgets to sign out.
//       // ...
//       // New sign-in will be persisted with session persistence.
//       return firebase.auth().signInWithPopup(provider);
//     })
//     .catch(function (error) {
//       // Handle Errors here.
//       var errorCode = error.code;
//       var errorMessage = error.message;
//     })}
// />

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
