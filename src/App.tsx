// tslint:disable:file-name-casing

import React from 'react';
import { useScreens } from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';
import codePush from 'react-native-code-push';
import { compose } from '@typed/compose';

import AppNavigator from 'src/navigators/AppNavigator';
import firebaseInit from 'src/models/firebase';

import { withLocaleProvider } from 'src/utils/hocs/withLocale';

firebaseInit();

const Constants = {
  minimumBkgDurationForInstall: 10,
};

class App extends React.PureComponent<{}> {
  componentDidMount() {
    useScreens();
    SplashScreen.hide();
  }

  render() {
    return <AppNavigator />;
  }
}

const enhance = compose(
  withLocaleProvider,
  codePush({
    checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
    installMode: codePush.InstallMode.ON_NEXT_SUSPEND,
    minimumBackgroundDuration: Constants.minimumBkgDurationForInstall,
  }),
);
export default enhance(App);
// tslint:enable:file-name-casing
