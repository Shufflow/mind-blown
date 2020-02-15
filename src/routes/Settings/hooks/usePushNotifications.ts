import { useWorkerState, useWorker } from 'react-hook-utilities';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';

export const usePushNotifications = () => {
  const {
    data: isPushEnabled,
    isLoading: isLoadingStatus,
    callback: checkStatus,
  } = useWorkerState(
    async () =>
      messaging().isRegisteredForRemoteNotifications &&
      new Promise<boolean>(resolve => {
        PushNotificationIOS.checkPermissions(({ alert, badge, sound }) => {
          resolve(!!alert || !!badge || !!sound);
        });
      }),
    [],
    false,
  );

  const {
    callback: handleTogglePushNotification,
    isLoading: isLoadingUpdate,
  } = useWorker(
    async (enabled: boolean) => {
      if (enabled) {
        const {
          alert,
          badge,
          sound,
        } = await PushNotificationIOS.requestPermissions();
        if (!!alert || !!badge || !!sound) {
          await messaging().registerForRemoteNotifications();
        }
      } else {
        await messaging().unregisterForRemoteNotifications();
      }

      await checkStatus();
    },
    [checkStatus],
  );

  return {
    handleTogglePushNotification,
    isPushEnabled,
    isLoading: isLoadingStatus || isLoadingUpdate,
  };
};
