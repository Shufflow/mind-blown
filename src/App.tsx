// tslint:disable:file-name-casing

import React from 'react';
import { useScreens } from 'react-native-screens';

import AppNavigator from 'src/navigators/AppNavigator';

import { withLocaleProvider } from 'src/utils/hocs/withLocale';

useScreens();
const App = (): React.ReactElement<{}> => <AppNavigator />;

export default withLocaleProvider(App);
// tslint:enable:file-name-casing
