import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { startCase } from 'lodash';

import routeNames from 'src/routes';

import Settings from 'src/routes/Settings';
import RedditPhrases from 'src/routes/RedditPhrases';
import SendSuggestion from 'src/routes/SendSuggestion';
import DevMenu from 'src/routes/DevMenu';

import { getColor } from 'src/models/assets';

import styles from './styles';

const routes = {
  [routeNames.Settings]: Settings,
  [routeNames.RedditPhrases]: RedditPhrases,
  [routeNames.SendSuggestion]: SendSuggestion,
  [routeNames.DevMenu]: DevMenu,
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
  headerLayoutPreset: 'center',
  mode: 'modal',
});

export default createAppContainer(SettingsNavigator);
