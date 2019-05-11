import React from 'react';
import LoginPage from '../LoginPage';
import App from '../../App';
import useLogger from '../../Utils/useLogger';
import { Store } from '../../Store';
import useCookie from '../../Utils/useCookie';
import { BrowserRouter, withRouter } from 'react-router-dom';

const AuthManager = props => {
  let user = '';
  const { state, dispatch } = React.useContext(Store);
  const [error, setError] = React.useState(false);
  const [usersCookie, setUsersCookie] = useCookie('spleat-user-details', '');

  // Get from local storage by key
  user = state ? state.user : '';

  if (user == '') {
    // Parse stored json or if none return initialValue
    console.log('No user on state, trying to retrive from cookies..');
    try {
      user = usersCookie ? JSON.parse(usersCookie) : '';
    } catch (ex) {
      setError(true);
    }

    if (user != '')
      dispatch({
        type: 'USER_LOGIN',
        payload: user,
      });
  }

  console.log(`the user is : ${user}`);
  console.log(!user ? 'User not found..' : `The user is : ${user}`);

  useLogger('AuthManager');

  return (
    <React.Fragment>
      <BrowserRouter>{console.log(!user ? '/login' : '/shoot')}</BrowserRouter>
    </React.Fragment>
  );
};

export default AuthManager;
