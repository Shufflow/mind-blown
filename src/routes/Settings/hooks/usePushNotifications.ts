import { useWorkerState, useWorker } from 'react-hook-utilities';
import messaging from '@react-native-firebase/messaging';

import PushNotificationPermisions from 'src/models/pushNotificationsPermissions';

export const usePushNotifications = () => {
  const {
    data: isPushEnabled,
    isLoading: isLoadingStatus,
    callback: checkStatus,
  } = useWorkerState(
    async () => PushNotificationPermisions.isEnabled(),
    [],
    false,
  );

  const {
    callback: handleTogglePushNotification,
    isLoading: isLoadingUpdate,
  } = useWorker(
    async (enabled: boolean) => {
      if (enabled) {
        const granted = await PushNotificationPermisions.requestPermissions();
        if (granted) {
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
