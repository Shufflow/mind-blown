import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

const PushNotificationPermisions = {
  isEnabled: async () =>
    messaging().isRegisteredForRemoteNotifications &&
    Platform.select({
      android: () => messaging().hasPermission(),
      ios: async () =>
        new Promise<boolean>(resolve => {
          PushNotification.checkPermissions(({ alert, badge, sound }) => {
            resolve(!!alert || !!badge || !!sound);
          });
        }),
    })!(),

  requestPermissions: () =>
    Platform.select({
      android: () => messaging().requestPermission(),
      ios: () =>
        PushNotification.requestPermissions(['alert', 'badge', 'sound']).then(
          ({ alert, badge, sound }) => !!alert || !!badge || !!sound,
        ),
    })!(),
};

export default PushNotificationPermisions;
