import { createStackNavigator, createAppContainer } from 'react-navigation';

import routeNames from 'src/routes';

import Home from 'src/routes/Home';

import SettingsNavigator from './settingsNavigator';

const routes = {
  [routeNames.Home]: Home,
  [routeNames.Settings]: SettingsNavigator,
};

const AppNavigator = createStackNavigator(routes, {
  headerMode: 'none',
  mode: 'modal',
});

export default createAppContainer(AppNavigator);
