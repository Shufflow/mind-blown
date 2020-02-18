import { useWorkerState, useWorker } from 'react-hook-utilities';

import { useLocale } from '@utils/hocs/withLocale';

import PushNotificationPermisions from 'src/models/pushNotificationsPermissions';

export const usePushNotifications = () => {
  const { locale } = useLocale();
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
        await PushNotificationPermisions.requestPermissions(locale);
      } else {
        await PushNotificationPermisions.disablePushNotification(locale);
      }

      await checkStatus();
    },
    [checkStatus, locale],
  );

  return {
    handleTogglePushNotification,
    isPushEnabled,
    isLoading: isLoadingStatus || isLoadingUpdate,
  };
};
