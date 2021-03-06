import React from 'react';
import { Store } from '../../Store';
import useLogger from '../../Utils/useLogger';
import useCookie from '../../Utils/useCookie';
import '../../App.css';
import logo from '../../logo.png';
import { Redirect } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { FirebaseContext } from '../../Firebase';

const LoginPage = props => {
  const { state, dispatch } = React.useContext(Store);
  const firebase = React.useContext(FirebaseContext);
  const [usersCookie, setUsersCookie, removeUsersCookie] = useCookie(
    'spleat-user-details',
    ''
  );
  const [error, setError] = React.useState(false);
  const uiConfig = {
    signInOptions: [firebase.app.auth.FacebookAuthProvider.PROVIDER_ID],
    callbacks: {
      signInSuccess: () => false,
    },
  };

  useLogger('LoginPage');

  React.useState(() => {
    //firebase.auth().signOut();
    firebase.app.auth().onAuthStateChanged(user => {
      if (user != null) {
        setUsersCookie(JSON.stringify(user), { expired: 7 }); // TODO : Take the expiry date from the response
        dispatch({
          type: 'USER_LOGIN',
          payload: user,
        });
      }
    });
  });

  React.useEffect(() => {
    if (props.isLogOut) {
      removeUsersCookie();
      dispatch({
        type: 'USER_LOGOUT',
      });
    }
  }, [props.isLogOut]);

  const facebookLoginCallback = response => {
    if (response && response.name) {
      setUsersCookie(JSON.stringify(response), { expired: 7 }); // TODO : Take the expiry date from the response
      dispatch({
        type: 'USER_LOGIN',
        payload: response,
      });
      // setRedirectToReferrer(true); // Used to return the user to the wanted page before redirected to /login
    } else {
      console.log('Error while retriving the user from facebook..');
      setError(true);
    }
  };

  let from =
    props.location && props.location.state
      ? props.location.state
      : { from: { pathname: '/' } };

  if (state.user && state.userLoggedIn && firebase.app.auth().currentUser) {
    return <Redirect to={from.from} />;
  }

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="Spleat Logo" />
      {error ? <p>אופס.. משהו השתבש, נסו שנית!</p> : null}
      <div style={{ marginTop: '30%' }}>
        <br />
        <div style={{ marginTop: '30%' }}>
          <StyledFirebaseAuth
            uiConfig={uiConfig}
            firebaseAuth={firebase.app.auth()}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

// import {useLocation} from 'react-use/lib/useLocation';
// import useQrCode from "react-qrcode-hook";

// const location = useLocation();
// const getLocation = loc => <pre>{JSON.stringify(loc, null, 2)}</pre>;

//const qrCode = useQrCode("Hello There");
// return (
//   <div
//     style={{
//       width: "100%",
//       height: "100%",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center"
//     }}
//   >
//     <img alt="qr code" src={qrCode} />
//   </div>
// );

//  import usePrevious from '../../Utils/usePrevious';
//  const previousValues = usePrevious({ state, props });

// React.useEffect(() => {
//   if (previousValues && previousValues.state) {
//     if (JSON.stringify(previousValues.state) != JSON.stringify(state)) {
//       console.log('state changed :', previousValues.state, state);
//     }
//   }
// }, [previousValues]);
