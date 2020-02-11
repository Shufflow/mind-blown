// tslint:disable:file-name-casing

import React, { useCallback } from 'react';
import { Linking } from 'react-native';
import { enableScreens } from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';
import codePush from 'react-native-code-push';
import { useDidMount } from 'react-hook-utilities';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS, {
  PushNotification,
} from '@react-native-community/push-notification-ios';

import { compose } from '@utils/compose';
import { setupLocale } from '@locales';
import { withLocaleProvider, LocaleProviderProps } from '@hocs/withLocale';
import { withAdsProvider } from '@hocs/withAds';

import { LoaderComponent } from '@components/Loader';

import AppNavigator from 'src/navigators/AppNavigator';
import 'src/models/firebase';
import '@utils/errors';

const Constants = {
  appScheme: 'mibl://',
  minimumBkgDurationForInstall: 10,
};

const App = ({ setLocale }: LocaleProviderProps) => {
  useDidMount(async () => {
    enableScreens();
    SplashScreen.hide();

    setLocale(await setupLocale());

    messaging()
      .registerForRemoteNotifications()
      .catch();
  });

  const handlePushNotification = useCallback((msg: PushNotification) => {
    const { url } = msg.getData();
    if (!!url) {
      Linking.canOpenURL(url).then(() => Linking.openURL(url));
    }
  }, []);

  useDidMount(() => {
    PushNotificationIOS.addEventListener(
      'notification',
      handlePushNotification,
    );
    return () => {
      PushNotificationIOS.removeEventListener(
        'notification',
        handlePushNotification,
      );
    };
  });

  return (
    <React.Fragment>
      <AppNavigator uriPrefix={Constants.appScheme} />
      <LoaderComponent />
    </React.Fragment>
  );
};

const enhance = compose(
  withLocaleProvider,
  withAdsProvider,
  codePush({
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    installMode: codePush.InstallMode.ON_NEXT_SUSPEND,
    minimumBackgroundDuration: Constants.minimumBkgDurationForInstall,
  }),
);
export default enhance(App);
// tslint:enable:file-name-casing
