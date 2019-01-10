// tslint:disable:file-name-casing

import React from 'react';

import AppNavigator from 'src/navigators/appNavigator';

import { withLocaleProvider } from 'src/utils/hocs/withLocale';

const App = (): React.ReactElement<{}> => <AppNavigator />;

export default withLocaleProvider(App);
// tslint:enable:file-name-casing
