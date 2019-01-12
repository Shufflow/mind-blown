import firebase from 'firebase';
import { GoogleSignin } from 'react-native-google-signin';
import Config from 'react-native-config';

const firebaseInit = () => {
  firebase.initializeApp({
    apiKey: Config.FIREBASE_API_KEY,
    authDomain: `${Config.FIREBASE_PROJECT_ID}.firebaseapp.com`,
    databaseURL: `https://${Config.FIREBASE_PROJECT_ID}.firebaseio.com`,
    messagingSenderId: Config.FIREBASE_MSG_SENDER_ID,
    projectId: Config.FIREBASE_PROJECT_ID,
    storageBucket: `${Config.FIREBASE_PROJECT_ID}.appspot.com`,
  });
  GoogleSignin.configure({
    iosClientId: Config.FIREBASE_IOS_CLIENT_ID,
  });
};

export default firebaseInit;
