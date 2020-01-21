import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import RouteName from '@routes';
import Home from '@routes/Home';

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
