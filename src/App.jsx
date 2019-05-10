import React, { useState, useEffect } from 'react';
import { Store } from './Store';
import 'react-image-crop/dist/ReactCrop.css';
import logo from './logo.png';
import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import { css } from '@emotion/core';
import { SyncLoader } from 'react-spinners';
import ScanPage from './components/ScanPage';
import itemsList from './ItemsList';
import NotFoundComponent from './components/NotFoundComponent';
import LoginPage from './LoginPage';
import usePrevious from './Utils/usePrevious';
import useLogger from './Utils/useLogger';

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

function App(props) {
  const { state, dispatch } = React.useContext(Store);
  const [shouldAuthenticate, setShouldAuthenticate] = useState(false);
  const previousValues = usePrevious({ state, shouldAuthenticate });

  useLogger('App', 'app');

  useEffect(() => {
    if (previousValues) {
      if (previousValues.state && previousValues.state != state)
        console.log('state changed :', previousValues.state, state);
      if (
        previousValues.shouldAuthenticate &&
        previousValues.shouldAuthenticate != shouldAuthenticate
      )
        console.log(
          'shouldAuthenticate changed :',
          previousValues.shouldAuthenticate,
          shouldAuthenticate
        );
    }
  });

  useEffect(() => {
    if (!state.userLoggedIn) {
      if (!window.location.href.includes('/login')) {
        console.log('going to /login...');
        setShouldAuthenticate(true);
      } else {
        console.log('already in /login...');
      }
    } else {
      console.log('user is already logged in...');
    }
  }, [state.userLoggedIn]);

  return (
    <React.Fragment>
      <BrowserRouter>
        {console.log(window.location.href)}
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
          {shouldAuthenticate && <Redirect to="/login" />}
          <Switch>
            <Route exact path="/" component={ScanPage} />
            <Route path="/login" component={LoginPage} />
            <Route
              path="/logout"
              render={() => {
                return <LoginPage isLogOut={true} />;
              }}
            />
            <Route path="/itemsList" component={itemsList} />
            <Route component={NotFoundComponent} />
          </Switch>
        </div>
      </BrowserRouter>
    </React.Fragment>
  );
}

export default App;