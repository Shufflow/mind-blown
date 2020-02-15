import { Linking } from 'react-native';
import { useDidMount } from 'react-hook-utilities';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

const handleNotification = async ({ url, data, finish }: any) => {
  if ((!!url || !!data?.url) && (await Linking.canOpenURL(url ?? data?.url))) {
    await Linking.openURL(url ?? data?.url);
  }

  finish?.('UIBackgroundFetchResultNoData');
};

const usePushNotifications = () => {
  useDidMount(() => {
    PushNotification.configure({
      onNotification: handleNotification,
      requestPermissions: false,
    });
  });

  messaging().onMessage(handleNotification);
};

export default usePushNotifications;
