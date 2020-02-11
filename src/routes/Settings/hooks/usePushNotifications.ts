import { useWorkerState, useWorker } from 'react-hook-utilities';
import messaging from '@react-native-firebase/messaging';

export const usePushNotifications = () => {
  const {
    data: isPushEnabled,
    isLoading: isLoadingStatus,
    callback: checkStatus,
  } = useWorkerState(
    async () =>
      messaging().isRegisteredForRemoteNotifications &&
      messaging().hasPermission(),
    [],
    false,
  );

  const {
    callback: handleTogglePushNotification,
    isLoading: isLoadingUpdate,
  } = useWorker(
    async (enabled: boolean) => {
      if (enabled) {
        const granted = await messaging().requestPermission();
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
