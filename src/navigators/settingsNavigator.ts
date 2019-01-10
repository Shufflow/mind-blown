import { createStackNavigator, createAppContainer } from 'react-navigation';

import routeNames from 'src/routes';

import Settings from 'src/routes/Settings';
import RedditPhrases from 'src/routes/RedditPhrases';
import SendSuggestion from 'src/routes/SendSuggestion';

const routes = {
  [routeNames.Settings]: Settings,
  [routeNames.RedditPhrases]: RedditPhrases,
  [routeNames.SendSuggestion]: SendSuggestion,
};

const SettingsNavigator = createStackNavigator(routes, {
  headerMode: 'none',
  mode: 'modal',
});

export default createAppContainer(SettingsNavigator);
