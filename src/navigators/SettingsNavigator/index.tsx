import React from 'react';
import { Text } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import t from '@locales';
import RouteName from '@routes';

import Settings from '@routes/Settings';
import ModeratePhrases from '@routes/ModeratePhrases';
import SendSuggestion from '@routes/SendSuggestion';
import DevMenu from '@routes/DevMenu';
import Licenses from '@routes/Licenses';
import About from '@routes/About';
import ModerateSuggestions from '@routes/ModerateSuggestions';

import { getColor } from 'src/models/assets';

import styles from './styles';

const routes = {
  [RouteName.Settings]: Settings,
  [RouteName.ModeratePhrases]: ModeratePhrases,
  [RouteName.SendSuggestion]: SendSuggestion as any,
  [RouteName.DevMenu]: DevMenu,
  [RouteName.Licenses]: Licenses,
  [RouteName.About]: About,
  [RouteName.ModerateSuggestions]: ModerateSuggestions,
};

const SettingsNavigator = createStackNavigator(routes, {
  defaultNavigationOptions: ({ navigation }: any) => {
    if (!navigation.color) {
      navigation.color = getColor();
    }

    return {
      headerBackTitle: null as any, // TODO: remove when react-navigation fix `headerBackTitle?: string` type
      headerStyle: styles.header(navigation.color.dark),
      headerTintColor: navigation.color.light,
      headerTitle: () => (
        <Text style={styles.text(navigation.color.light)}>
          {t(navigation.state.routeName)}
        </Text>
      ),
      headerTitleAlign: 'center',
    };
  },
});

export default createAppContainer(SettingsNavigator);
