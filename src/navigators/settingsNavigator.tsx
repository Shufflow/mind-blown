import React from 'react';
import { Text } from 'react-native';
import {
  createStackNavigator,
  createAppContainer,
  NavigationParams,
  NavigationScreenProp,
  NavigationRoute,
} from 'react-navigation';
import { startCase } from 'lodash';

import routeNames from 'src/routes';

import Settings from 'src/routes/Settings';
import RedditPhrases from 'src/routes/RedditPhrases';
import SendSuggestion from 'src/routes/SendSuggestion';

import { getColor } from 'src/models/assets';
import { Color } from 'src/assets/colorPairs';

export interface ColoredScreenProps<Params = NavigationParams> {
  navigation: NavigationScreenProp<NavigationRoute<Params>, Params> & {
    color: Color;
  };
}

const routes = {
  [routeNames.Settings]: {
    ...Settings,
    screen: (args: any) => <Settings {...args} />,
  },
  [routeNames.RedditPhrases]: RedditPhrases,
  [routeNames.SendSuggestion]: SendSuggestion,
};

const SettingsNavigator = createStackNavigator(routes, {
  defaultNavigationOptions: ({ navigation }: any) => {
    if (!navigation.color) {
      navigation.color = getColor();
    }

    return {
      headerStyle: { backgroundColor: navigation.color.dark },
      headerTintColor: navigation.color.light,
      headerTitle: (
        <Text style={{ color: navigation.color.light, fontSize: 20 }}>
          {startCase(navigation.state.routeName)}
        </Text>
      ),
    };
  },
  mode: 'modal',
});

export default createAppContainer(SettingsNavigator);
