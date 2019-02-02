import { createStackNavigator, createAppContainer } from 'react-navigation';

import RouteName from 'src/routes';

import Home from 'src/routes/Home';

import SettingsNavigator from 'src/navigators/SettingsNavigator';

const routes = {
  [RouteName.Home]: Home,
  [RouteName.Settings]: SettingsNavigator,
};

const AppNavigator = createStackNavigator(routes, {
  headerMode: 'none',
  mode: 'modal',
});

export default createAppContainer(AppNavigator);
