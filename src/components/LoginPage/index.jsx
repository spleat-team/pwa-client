import React from 'react';
import FacebookLoginWithButton from 'react-facebook-login';
import { Store } from '../../Store';
import useLogger from '../../Utils/useLogger';
import useCookie from '../../Utils/useCookie';
import '../../App.css';
import logo from '../../logo.png';
import { Redirect } from 'react-router-dom';
import firebase from 'firebase';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import { FirebaseContext } from '../../Firebase';

// const firebaseConfig = {
//   apiKey: 'AIzaSyA4uCgHWUewD5XHo05GrRNmd5diYaUN9n4',
//   authDomain: 'spleat-4629b.firebaseapp.com',
//   databaseURL: 'https://spleat-4629b.firebaseio.com',
//   projectId: 'spleat-4629b',
//   storageBucket: 'spleat-4629b.appspot.com',
//   messagingSenderId: '761349823555',
//   appId: '1:761349823555:web:ba956c9f71eedae5',
// };

// firebase.initializeApp(firebaseConfig);
// var provider = new firebase.auth.FacebookAuthProvider();

const LoginPage = props => {
  const { state, dispatch } = React.useContext(Store);
  const firebase = React.useContext(FirebaseContext);

  const [usersCookie, setUsersCookie, removeUsersCookie] = useCookie(
    'spleat-user-details',
    ''
  );
  const [error, setError] = React.useState(false);
  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);
  const [isSignedIn, setIsSignedIn] = React.useState(false);

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
        console.log('back from facebook with : ', user);
        setIsSignedIn(!!user);
        setUsersCookie(JSON.stringify(user), { expired: 7 }); // TODO : Take the expiry date from the response
        dispatch({
          type: 'USER_LOGIN',
          payload: user,
        });
      }
    });
  });

  React.useEffect(() => {
    console.log('effect in LoginPage with props: ', props);
    if (props.isLogOut) {
      console.log('logged out...');
      removeUsersCookie();
      dispatch({
        type: 'USER_LOGOUT',
      });
    }
  }, [props.isLogOut]);

  const facebookLoginCallback = response => {
    console.log('back from facebook with : ', response);

    if (response && response.name) {
      setUsersCookie(JSON.stringify(response), { expired: 7 }); // TODO : Take the expiry date from the response
      dispatch({
        type: 'USER_LOGIN',
        payload: response,
      });
      setRedirectToReferrer(true); // Used to return the user to the wanted page before redirected to /login
    } else {
      console.log('Error while retriving the user from facebook..');
      setError(true);
    }
  };

  const componentClicked = () => console.log('clicked');

  // TODO: set the previos page to go back (if exists)
  let from = { from: { pathname: '/' } }; // props.location.state || { from: { pathname: '/' } };

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="Spleat Logo" />
      {error ? <p>אופס.. משהו השתבש, נסו שנית!</p> : null}
      {!state.user ||
      !state.userLoggedIn ||
      !firebase.app.auth().currentUser ? (
        <div style={{ marginTop: '30%' }}>
          <p style={{ marginLeft: '7%', marginRight: '7%', direction: 'rtl' }}>
            לפני שנתחיל - היינו רוצים להכיר אותך קצת יותר טוב, מה דעתך על לחבר
            את הפייסבוק?
          </p>
          <div style={{ marginTop: '30%' }}>
            {
              // <FacebookLoginWithButton
              //     appId="339944453372114"
              //     autoLoad={false}
              //     fields="name,email,picture"
              //     onClick={componentClicked}
              //     callback={facebookLoginCallback}
              //   />
            }
            <StyledFirebaseAuth
              uiConfig={uiConfig}
              firebaseAuth={firebase.app.auth()}
              // .signInWithPopup(provider)
              // .then(result => {
              //   console.log(result);
              // })
              // .catch(error => console.log('kaki ', error))}
            />
          </div>
        </div>
      ) : (
        // TODO : Redirect to where the user came from
        <Redirect to={from} />
      )}
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
