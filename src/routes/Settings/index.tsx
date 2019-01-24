import { compose } from '@typed/compose';
import React from 'react';
import { View, StatusBar, Linking, ScrollView } from 'react-native';
import Config from 'react-native-config';

import { LocaleConsumerProps, withLocale } from 'src/utils/hocs/withLocale';
import pure from 'src/utils/hocs/pure';
import Constants from 'src/utils/constants';

import AdIds from 'src/models/ads';
import { ColoredScreenProps } from 'src/navigators/SettingsNavigator/types';
import routeNames from 'src/routes';
import t, { Settings as strings, Global as globalStrings } from 'src/locales';

import Dev from 'src/components/Dev';
import ListItem from 'src/components/ListItem';
import HeaderButton from 'src/components/HeaderButton';
import AdBanner from 'src/components/AdBanner';
import Button, { ButtonTheme } from 'src/components/Button';

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

const openURL = (url: string) => async () => Linking.openURL(url);

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
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
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
          <ListItem
            label={t(strings.licenses)}
            onPress={navigate(props, routeNames.Licenses)}
          />
          <Dev condition={Config.SHOW_DEV_MENU}>
            <ListItem
              label={t(strings.devMenu)}
              onPress={navigate(props, routeNames.DevMenu)}
              style={styles.devItem}
            />
          </Dev>
        </View>
        <View style={styles.footerContainer}>
          <Button
            hasShadow={false}
            theme={ButtonTheme.minimalist}
            onPress={openURL(Constants.repoURL)}
            style={styles.footerLink}
            textStyle={styles.footerLinkText}
          >
            {t(strings.madeBy)}
          </Button>
          <Button
            hasShadow={false}
            theme={ButtonTheme.minimalist}
            onPress={openURL(Constants.agnesURL)}
            style={styles.footerLink}
            textStyle={styles.footerLinkText}
          >
            {t(strings.artBy)}
          </Button>
        </View>
      </ScrollView>
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
