import { compose } from '@typed/compose';
import React from 'react';
import { View, StatusBar } from 'react-native';
import Config from 'react-native-config';

import { LocaleConsumerProps, withLocale } from 'src/utils/hocs/withLocale';
import pure from 'src/utils/hocs/pure';

import AdIds from 'src/models/ads';
import { ColoredScreenProps } from 'src/navigators/SettingsNavigator/types';
import routeNames from 'src/routes';
import t, { Settings as strings, Global as globalStrings } from 'src/locales';

import Dev from 'src/components/Dev';
import ListItem from 'src/components/ListItem';
import HeaderButton from 'src/components/HeaderButton';
import AdBanner from 'src/components/AdBanner';

import LanguagePicker from './components/LanguagePicker';
import styles from './styles';

interface Props extends LocaleConsumerProps, ColoredScreenProps {}

const navigate = (
  { navigation }: ColoredScreenProps,
  routeName: string,
) => () => {
  const { dark, light } = navigation.color;
  navigation.navigate(routeName, {
    dark,
    light,
  });
};

const Settings = (props: Props) => {
  const {
    navigation: {
      color: { dark, light },
    },
    locale,
    setLocale,
  } = props;
  return (
    <View style={styles.container(light)}>
      <View style={styles.itemsContainer}>
        <StatusBar barStyle='light-content' />
        <LanguagePicker
          dark={dark}
          light={light}
          locale={locale}
          onSelectValue={setLocale}
        />
        <ListItem
          label={t(strings.sendSuggestion)}
          onPress={navigate(props, routeNames.SendSuggestion)}
        />
        <Dev>
          <ListItem
            label={t(strings.devMenu)}
            onPress={navigate(props, routeNames.DevMenu)}
          />
        </Dev>
        <Dev>
          {dark} - {light}
          {`\n`}
          {Config.FIREBASE_PROJECT_ID}
        </Dev>
      </View>
      <AdBanner adUnitID={AdIds.settingsBottomBanner} />
    </View>
  );
};

const Enhanced = compose(
  pure,
  withLocale,
)(Settings);
Enhanced.navigationOptions = ({ navigation }: Props) => ({
  headerRight: (
    <HeaderButton color={navigation.color.light} onPress={navigation.dismiss}>
      {t(globalStrings.done)}
    </HeaderButton>
  ),
});

export default Enhanced;
