// tslint:disable:file-name-casing

import React from 'react';
import { enableScreens } from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';
import codePush from 'react-native-code-push';
import { useDidMount } from 'react-hook-utilities';
import hooked from 'react-hook-hooked';
import messaging from '@react-native-firebase/messaging';

import { compose } from '@utils/compose';
import { setupLocale } from '@locales';
import { withLocaleProvider, LocaleProviderProps } from '@hocs/withLocale';
import { withAdsProvider } from '@hocs/withAds';

import { LoaderComponent } from '@components/Loader';

import AppNavigator from 'src/navigators/AppNavigator';
import 'src/models/firebase';
import '@utils/errors';

import usePushNotifications from './hooks';

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
  hooked(usePushNotifications),
);
export default enhance(App);
// tslint:enable:file-name-casing
