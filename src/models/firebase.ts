import { Platform } from 'react-native';
import firebase from 'firebase';
import { GoogleSignin } from '@react-native-community/google-signin';
import Config from 'react-native-config';

const fbConfig = {
  apiKey: Config.FIREBASE_API_KEY as string,
  appId: Platform.select({
    android: Config.FIREBASE_ANDROID_APP_ID,
    ios: Config.FIREBASE_IOS_APP_ID,
  }),
  authDomain: `${Config.FIREBASE_PROJECT_ID}.firebaseapp.com`,
  databaseURL: `https://${Config.FIREBASE_PROJECT_ID}.firebaseio.com`,
  messagingSenderId: Config.FIREBASE_MSG_SENDER_ID,
  projectId: Config.FIREBASE_PROJECT_ID,
  storageBucket: `${Config.FIREBASE_PROJECT_ID}.appspot.com`,
};
firebase.initializeApp(fbConfig);
GoogleSignin.configure({
  iosClientId: Config.FIREBASE_IOS_CLIENT_ID,
});
GoogleSignin.signInSilently().catch(() => {});
