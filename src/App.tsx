// tslint:disable:file-name-casing

import React from 'react';
import { useScreens } from 'react-native-screens';
import SplashScreen from 'react-native-splash-screen';

import AppNavigator from 'src/navigators/AppNavigator';
import firebaseInit from 'src/models/firebase';

import { withLocaleProvider } from 'src/utils/hocs/withLocale';

firebaseInit();

class App extends React.PureComponent<{}> {
  componentDidMount() {
    useScreens();
    SplashScreen.hide();
  }

  render() {
    return <AppNavigator />;
  }
}

export default withLocaleProvider(App);
// tslint:enable:file-name-casing
