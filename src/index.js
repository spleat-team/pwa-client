import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import { StoreProvider } from './Store';
import { create } from 'jss';
import rtl from 'jss-rtl';
import JssProvider from 'react-jss/lib/JssProvider';
import {
  createGenerateClassName,
  jssPreset,
  MuiThemeProvider,
  createMuiTheme,
} from '@material-ui/core/styles';
import { blue, yellow } from '@material-ui/core/colors';

import App from './App';
import Firebase, { FirebaseContext } from './Firebase';

// Configure JSS //for rtl support
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });

const theme = createMuiTheme({
  direction: 'rtl', // Both here and <body dir="rtl">
  palette: {
    primary: {
      main: '#4197ED',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ffea00',
      contrastText: '#1f5488',
    },
  },
});

// Custom Material-UI class name generator. //for rtl support
const generateClassName = createGenerateClassName();

const firebase = Firebase.initialize();

const RootComp = props => {
  return (
    <FirebaseContext.Provider value={firebase}>
      <StoreProvider>
        <JssProvider jss={jss} generateClassName={generateClassName}>
          <MuiThemeProvider theme={theme}>
            <App />
          </MuiThemeProvider>
        </JssProvider>
      </StoreProvider>
    </FirebaseContext.Provider>
  );
};

ReactDOM.render(<RootComp />, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();