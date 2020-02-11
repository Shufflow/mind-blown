import React, { useCallback } from 'react';
import { View, StatusBar, ScrollView, Alert } from 'react-native';
import Config from 'react-native-config';
import hooked from 'react-hook-hooked';

import t, {
  Settings as strings,
  AdFreeErrorAlert as errorAlert,
} from '@locales';
import RouteName from '@routes';
import { withAds } from '@hocs/withAds';
import withDoneButton from '@hocs/withDoneButton';
import { compose } from '@utils/compose';

import Dev from '@components/Dev';
import ListItem from '@components/ListItem';
import AdBanner from '@components/AdBanner';
import Loader from '@components/Loader';

import AdIds from 'src/models/ads';

import LanguagePicker from './components/LanguagePicker';
import styles from './styles';
import hooks, { Props } from './hooks';

const Settings = ({
  handleBuyAdFree,
  navigation: {
    color: { light, dark },
  },
  locale,
  canBuyDiscount,
  handleNavigate,
  handleSetLocale,
  isAdFree,
  isIAPAvailable,
}: Props) => {
  const onBuyAdFree = useCallback(async () => {
    Loader.show();

    try {
      await handleBuyAdFree();
    } catch (e) {
      if (__DEV__) {
        // tslint:disable-next-line: no-console
        console.warn(e);
      }

      Alert.alert(t(errorAlert.title), t(errorAlert.message));
    }

    Loader.hide();
  }, []);

  const addFreeButtonText = isAdFree
    ? strings.isAdFreeButton
    : canBuyDiscount
    ? strings.removeAdsDiscount
    : strings.removeAds;

  return (
    <View style={styles.container(light)}>
      <StatusBar barStyle='light-content' />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <LanguagePicker
          dark={dark}
          light={light}
          locale={locale}
          onSelectValue={handleSetLocale}
        />
        <ListItem
          label={t(strings.sendSuggestion)}
          onPress={handleNavigate(RouteName.SendSuggestion)}
        />
        <ListItem
          label={t(strings.about)}
          onPress={handleNavigate(RouteName.About)}
        />
        {isIAPAvailable && (
          <ListItem
            disabled={isAdFree}
            label={t(addFreeButtonText)}
            onPress={onBuyAdFree}
            style={styles.itemMarginTop}
          />
        )}
        <Dev condition={Config.SHOW_DEV_MENU}>
          <ListItem
            label={t(strings.devMenu)}
            onPress={handleNavigate(RouteName.DevMenu)}
            style={styles.itemMarginTop}
          />
        </Dev>
      </ScrollView>
      <AdBanner adUnitID={AdIds.settingsBottomBanner} />
    </View>
  );
};

const enhance = compose(withAds, hooked(hooks));
const Enhanced = enhance(Settings);
export default withDoneButton(Enhanced, ({ navigation }) => navigation.dismiss);
