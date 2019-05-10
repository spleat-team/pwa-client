import React, { useState } from 'react';
import FacebookLoginWithButton from 'react-facebook-login';
import { Store } from '../../Store';
import useLogger from '../../Utils/useLogger';
import useCookie from '../../Utils/useCookie';
import usePrevious from '../../Utils/usePrevious';
import '../../App.css';
import logo from '../../logo.png';

const LoginPage = props => {
  const { state, dispatch } = React.useContext(Store);
  const previousValues = usePrevious({ state, props });
  const [usersCookie, setUsersCookie] = useCookie('spleat-user-details', '');
  const [error, setError] = React.useState(false);

  useLogger('LoginPage');

  React.useEffect(() => {
    console.log('effect in LoginPage with props: ', props);
    if (props.isLogOut) {
      console.log('logged out...');
      setUsersCookie('');
      dispatch({
        type: 'USER_LOGOUT',
      });
    }
  }, [props.isLogOut]);

  React.useEffect(() => {
    if (previousValues && previousValues.state) {
      if (JSON.stringify(previousValues.state) != JSON.stringify(state)) {
        console.log('state changed :', previousValues.state, state);
      }
    }
  }, [previousValues]);

  const responseFacebook = response => {
    console.log('back from facebook with : ', response);

    if (response && response.name) {
      console.log('Got the user from facebook, setting it locally..');
      setUsersCookie(JSON.stringify(response));
      dispatch({
        type: 'USER_LOGIN',
        payload: response,
      });
    } else {
      console.log('Error while retriving the user from facebook..');
      setError(true);
    }
  };

  const componentClicked = () => console.log('clicked');

  return (
    <div className="App">
      <img src={logo} className="App-logo" alt="Spleat Logo" />
      {console.log('kakiiiiiiiiiiiiiiiiiiii', state)}
      {console.log('propssssssssssss', props)}
      {error ? <p>אופס.. משהו השתבש, נסו שנית!</p> : null}
      {(!state.user || !state.userLoggedIn) && (
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
              callback={responseFacebook}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;

// import { useLocation } from 'react-use/lib/useLocation';
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
