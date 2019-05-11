import React, { useState } from 'react';
import FacebookLoginWithButton from 'react-facebook-login';
import { Store } from '../../Store';
import useLogger from '../../Utils/useLogger';
import useCookie from '../../Utils/useCookie';
import usePrevious from '../../Utils/usePrevious';
import '../../App.css';
import logo from '../../logo.png';
import { Redirect, withRouter } from 'react-router-dom';

const LoginPage = props => {
  const { state, dispatch } = React.useContext(Store);
  const previousValues = usePrevious({ state, props });
  const [usersCookie, setUsersCookie, removeUsersCookie] = useCookie(
    'spleat-user-details',
    ''
  );
  const [error, setError] = React.useState(false);
  const [redirectToReferrer, setRedirectToReferrer] = React.useState(false);

  useLogger('LoginPage');

  React.useEffect(() => console.log('LOGINNNNNNN'));

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
  // let from = props.location.state || { from: { pathname: '/' } };

  return (
    <div className="App">
      {
        // redirectToReferrer && <Redirect to={from} />
      }
      <img src={logo} className="App-logo" alt="Spleat Logo" />
      {error ? <p>אופס.. משהו השתבש, נסו שנית!</p> : null}
      {!state.user || !state.userLoggedIn ? (
        <div style={{ marginTop: '30%' }}>
          <p style={{ marginLeft: '7%', marginRight: '7%', direction: 'rtl' }}>
            לפני שנתחיל - היינו רוצים להכיר אותך קצת יותר טוב, מה דעתך על לחבר
            את הפייסבוק?
          </p>
          <div style={{ marginTop: '30%' }}>
            <FacebookLoginWithButton
              appId="339944453372114"
              autoLoad={false}
              fields="name,email,picture"
              onClick={componentClicked}
              callback={facebookLoginCallback}
            />
          </div>
        </div>
      ) : (
          // TODO : Redirect to where the user came from
          <p>hi go to /shoot please..</p>
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

// React.useEffect(() => {
//   if (previousValues && previousValues.state) {
//     if (JSON.stringify(previousValues.state) != JSON.stringify(state)) {
//       console.log('state changed :', previousValues.state, state);
//     }
//   }
// }, [previousValues]);
