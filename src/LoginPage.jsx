import React from 'react';
import FacebookLoginWithButton from 'react-facebook-login';
import { Store } from './Store';
import useLogger from './Utils/useLogger';
import usePrevious from './Utils/usePrevious';

function LoginPage(props) {
  const { state, dispatch } = React.useContext(Store);
  const previousValues = usePrevious({ state, props });

  useLogger('LoginPage', 'kaki');

  React.useEffect(() => {
    console.log('effect in LoginPage with props: ', props);
    if (props.isLogOut) {
      console.log('logged out...');
      dispatch({
        type: 'USER_LOGOUT',
      });
    }
  });

  React.useEffect(() => {
    if (previousValues) {
      if (previousValues.state && previousValues.state != state)
        console.log('state changed :', previousValues.state, state);
    }
  });

  const responseFacebook = response => {
    console.log('back from facebook with : ', response);
    dispatch({
      type: 'USER_LOGIN',
      payload: response,
    });
  };

  const componentClicked = () => console.log('clicked');

  return (
    <div>
      {console.log('kakiiiiiiiiiiiiiiiiiiii', state)}
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

// import { useLocalStorage } from 'react-use/lib/useLocalStorage';
// import { useLocation } from 'react-use/lib/useLocation';
// import useQrCode from "react-qrcode-hook";

// const location = useLocation();
// const getLocation = loc => <pre>{JSON.stringify(loc, null, 2)}</pre>;
// const [user, setUser] = useLocalStorage('spleat-user-details', 'dam');

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
