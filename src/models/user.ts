import { firestore, auth } from 'firebase';
import messaging from '@react-native-firebase/messaging';

import { sanitizeLocale } from '@utils/locales';

const User = {
  isPushEnabled: async (): Promise<boolean> => {
    const userId = auth().currentUser?.uid;
    if (!userId) {
      return false;
    }

    const userDoc = await firestore()
      .collection('users')
      .doc(userId)
      .get();

    const userData = userDoc.data();
    return !!userData?.isPushEnabled;
  },

  setPushEnabled: async (
    isPushEnabled: boolean,
    currentLocale: string,
  ): Promise<boolean> => {
    const userId = auth().currentUser?.uid;
    if (!userId) {
      return false;
    }

    const userRef = firestore()
      .collection('users')
      .doc(userId);

    await Promise.all([
      isPushEnabled
        ? messaging().subscribeToTopic(sanitizeLocale(currentLocale))
        : messaging().unsubscribeFromTopic(sanitizeLocale(currentLocale)),
      isPushEnabled
        ? messaging().registerForRemoteNotifications()
        : messaging().unregisterForRemoteNotifications(),
      userRef.set(
        {
          isPushEnabled,
        },
        { merge: true },
      ),
    ]);

    if (isPushEnabled) {
      await messaging()
        .getToken()
        .then(apnsToken => userRef.update({ apnsToken }));
    }

    return true;
  },

  signIn: () => auth().signInAnonymously(),
};

export default User;
