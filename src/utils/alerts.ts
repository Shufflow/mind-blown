import { Alert } from 'react-native';

import t, { EnablePushAlert } from '@locales';

import Persist from 'src/models/persist';
import PushNotificationPermisions from 'src/models/pushNotificationsPermissions';

export const requestEnablePushNotifications = async (currentLocale: string) => {
  const persist = new Persist();
  const [didAsk, isEnabled] = await Promise.all([
    persist.didAskToEnablePushNotifications(),
    PushNotificationPermisions.isEnabled(),
  ]);
  if (didAsk || isEnabled) {
    return;
  }

  Alert.alert(t(EnablePushAlert.title), t(EnablePushAlert.message), [
    {
      onPress: () =>
        Promise.all([
          PushNotificationPermisions.requestPermissions(currentLocale),
          persist.setAskToEnablePushNotifications(true),
        ]),
      style: 'default',
      text: t(EnablePushAlert.ok),
    },
    { text: t(EnablePushAlert.later) },
    {
      onPress: () => persist.setAskToEnablePushNotifications(true),
      style: 'cancel',
      text: t(EnablePushAlert.cancel),
    },
  ]);
};
