import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

import User from 'src/models/user';

const PushNotificationPermisions = {
  isEnabled: async () =>
    messaging().isRegisteredForRemoteNotifications &&
    Promise.all([
      Platform.select({
        android: () => messaging().hasPermission(),
        ios: async () =>
          new Promise<boolean>(resolve => {
            PushNotification.checkPermissions(({ alert, badge, sound }) => {
              resolve(!!alert || !!badge || !!sound);
            });
          }),
      })?.(),
      User.isPushEnabled(),
    ]).then(([permissions, isEnabled]) => !!permissions && isEnabled),

  requestPermissions: (currentLocale: string) =>
    Platform.select({
      android: () => messaging().requestPermission(),
      ios: () =>
        PushNotification.requestPermissions(['alert', 'badge', 'sound']).then(
          ({ alert, badge, sound }) => !!alert || !!badge || !!sound,
        ),
    })?.().then(enabled =>
      User.setPushEnabled(enabled, currentLocale).then(() => enabled),
    ),

  disablePushNotification: (currentLocale: string) =>
    Promise.all([
      User.setPushEnabled(false, currentLocale),
      messaging().unregisterForRemoteNotifications(),
    ]).then(([didSet]) => didSet),
};

export default PushNotificationPermisions;
