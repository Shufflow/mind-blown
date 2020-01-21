import {
  GoogleSignin,
  statusCodes,
} from '@react-native-community/google-signin';
import firebase from 'firebase';

const googleLogin = async () => {
  try {
    const data = await GoogleSignin.signIn();

    const credential = firebase.auth.GoogleAuthProvider.credential(
      data.idToken,
    );

    await firebase.auth().signInAndRetrieveDataWithCredential(credential);
  } catch (e) {
    if (e.code !== statusCodes.SIGN_IN_CANCELLED) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  }
};

export default googleLogin;
