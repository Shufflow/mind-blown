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

import styles from './styles';

export interface ColoredScreenProps<Params = NavigationParams> {
  navigation: NavigationScreenProp<NavigationRoute<Params>, Params> & {
    color: Color;
  };
}

const routes = {
  [routeNames.Settings]: Settings,
  [routeNames.RedditPhrases]: RedditPhrases,
  [routeNames.SendSuggestion]: SendSuggestion,
};

const SettingsNavigator = createStackNavigator(routes, {
  defaultNavigationOptions: ({ navigation }: any) => {
    if (!navigation.color) {
      navigation.color = getColor();
    }

    return {
      headerLeft: null,
      headerStyle: styles.header(navigation.color.dark),
      headerTintColor: navigation.color.light,
      headerTitle: (
        <Text style={styles.text(navigation.color.light)}>
          {startCase(navigation.state.routeName)}
        </Text>
      ),
    };
  },
  mode: 'modal',
});

/// POG: sending `navigation.goBack` to `onPress` doesn't work
export const goBack = ({ navigation }: ColoredScreenProps) => () =>
  navigation.goBack();

export default createAppContainer(SettingsNavigator);
