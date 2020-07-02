import {
  GoogleSignin,
  statusCodes,
  User as GoogleUser,
} from '@react-native-community/google-signin';
import firebase from 'firebase';

type AuthMethod = () => Promise<GoogleUser>;

const signIn = async (signInMethod: AuthMethod) => {
  try {
    const data = await signInMethod();

    const credential = firebase.auth.GoogleAuthProvider.credential(
      data.idToken,
    );

    await firebase.auth().signInWithCredential(credential);
  } catch (e) {
    if (
      ![statusCodes.SIGN_IN_CANCELLED, statusCodes.SIGN_IN_REQUIRED].includes(
        e.code,
      )
    ) {
      // tslint:disable-next-line: no-console
      console.error(e);
    }
  }
};

export const googleLogin = () => signIn(GoogleSignin.signIn);

export const googleLoginSilently = () => signIn(GoogleSignin.signInSilently);

export default googleLogin;
