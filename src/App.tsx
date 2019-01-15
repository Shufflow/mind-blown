// tslint:disable:file-name-casing

import React from 'react';
import { Platform } from 'react-native';
import { useScreens } from 'react-native-screens';

import AppNavigator from 'src/navigators/AppNavigator';
import firebaseInit from 'src/models/firebase';

import { withLocaleProvider } from 'src/utils/hocs/withLocale';

useScreens(Platform.OS === 'ios');
firebaseInit();

const App = (): React.ReactElement<{}> => <AppNavigator />;

export default withLocaleProvider(App);
// tslint:enable:file-name-casing
