// tslint:disable:file-name-casing

import React from 'react';
import { enableScreens } from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';
import codePush from 'react-native-code-push';
import { compose } from '@typed/compose';

import { setupLocale } from '@locales';
import { withLocaleProvider, LocaleProviderProps } from '@hocs/withLocale';
import { withAdsProvider } from '@hocs/withAds';

import { LoaderComponent } from '@components/Loader';

import AppNavigator from 'src/navigators/AppNavigator';
import firebaseInit from 'src/models/firebase';

firebaseInit();

const Constants = {
  minimumBkgDurationForInstall: 10,
};

class App extends React.PureComponent<LocaleProviderProps> {
  async componentDidMount() {
    enableScreens();
    SplashScreen.hide();

    this.props.setLocale(await setupLocale());
  }

  render() {
    return (
      <React.Fragment>
        <AppNavigator />
        <LoaderComponent />
      </React.Fragment>
    );
  }
}

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
