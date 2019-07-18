import React from 'react';
import { Text } from 'react-native';
import { createStackNavigator, createAppContainer } from 'react-navigation';

import t from '@locales';
import RouteName from '@routes';

import Settings from '@routes/Settings';
import RedditPhrases from '@routes/RedditPhrases';
import SendSuggestion from '@routes/SendSuggestion';
import DevMenu from '@routes/DevMenu';
import Licenses from '@routes/Licenses';
import About from '@routes/About';

import { getColor } from 'src/models/assets';

import styles from './styles';

const routes = {
  [RouteName.Settings]: Settings,
  [RouteName.ModeratePhrases]: RedditPhrases,
  [RouteName.SendSuggestion]: SendSuggestion,
  [RouteName.DevMenu]: DevMenu,
  [RouteName.Licenses]: Licenses,
  [RouteName.About]: About,
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
