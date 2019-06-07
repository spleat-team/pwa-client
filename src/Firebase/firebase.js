import firebase from 'firebase';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyA4uCgHWUewD5XHo05GrRNmd5diYaUN9n4',
  authDomain: 'spleat-4629b.firebaseapp.com',
  databaseURL: 'https://spleat-4629b.firebaseio.com',
  projectId: 'spleat-4629b',
  storageBucket: 'spleat-4629b.appspot.com',
  messagingSenderId: '761349823555',
  appId: '1:761349823555:web:ba956c9f71eedae5',
};

// const requiredVars = ['apiKey', 'autoDomain', 'databaseURL', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];

// const { apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId } = process.env;

// const firebaseConfig = {
//   apiKey, authDomain, databaseURL, projectId, storageBucket, messagingSenderId, appId
// };

var Firebase = {
  isInitialized: false,
  initialize() {
    if (!this.isInitialized) {
      if (Object.values(firebaseConfig).indexOf('') != -1) {
        throw "Firebase's environment variables were not initialized";
      }

      this.isInitialized = true;
      firebase.initializeApp(firebaseConfig);
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          console.log(
            `Error while trying to save the session.. CODE : ${errorCode}, MESSAGE : ${errorMessage}`
          );
        });
      this.app = firebase;
    }

    return this;
  },
  get firebase() {
    if (!this.isInitialized) {
      throw Error('Firebase must be initilized first');
    }
    return this.app;
  },
};

export { Firebase };
export default Firebase;
