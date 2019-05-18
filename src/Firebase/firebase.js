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

var Firebase = {
  isInitialized: false,
  initialize() {
    if (!this.isInitialized) {
      this.isInitialized = true;
      firebase.initializeApp(firebaseConfig);
      this.app = firebase;
      this.auth = firebase.auth();
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
