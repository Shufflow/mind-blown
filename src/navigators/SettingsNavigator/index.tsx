import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import RouteName from 'src/routes';
import t from 'src/locales';

import Settings from 'src/routes/Settings';
import RedditPhrases from 'src/routes/RedditPhrases';
import SendSuggestion from 'src/routes/SendSuggestion';
import DevMenu from 'src/routes/DevMenu';
import Licenses from 'src/routes/Licenses';

import { getColor } from 'src/models/assets';

import styles from './styles';

const routes = {
  [RouteName.Settings]: Settings,
  [RouteName.RedditPhrases]: RedditPhrases,
  [RouteName.SendSuggestion]: SendSuggestion,
  [RouteName.DevMenu]: DevMenu,
  [RouteName.Licenses]: Licenses,
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
          {t(navigation.state.routeName)}
        </Text>
      ),
    };
  },
  headerLayoutPreset: 'center',
  mode: 'modal',
});

export default createAppContainer(SettingsNavigator);
