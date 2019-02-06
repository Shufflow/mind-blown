import React from 'react';
import { View, StatusBar, ScrollView, Alert } from 'react-native';
import Config from 'react-native-config';
import { compose } from '@typed/compose';

import t, {
  Settings as strings,
  AdFreeErrorAlert as errorAlert,
} from '@locales';
import RouteName from '@routes';
import { withLocale } from '@hocs/withLocale';
import { withAds } from '@hocs/withAds';
import withDoneButton from '@hocs/withDoneButton';

import Dev from '@components/Dev';
import ListItem from '@components/ListItem';
import AdBanner from '@components/AdBanner';
import SmartComponent from '@components/SmartComponent';
import Loader from '@components/Loader';

import AdIds from 'src/models/ads';

import SettingsViewModel, { State, Props } from 'src/viewModels/settings';

import LanguagePicker from './components/LanguagePicker';
import styles from './styles';

class Settings extends SmartComponent<Props, State, SettingsViewModel> {
  constructor(props: Props) {
    super(props, SettingsViewModel);
  }

  onBuyAdFree = async () => {
    Loader.show();

    try {
      await this.viewModel.handleBuyAdFree();
    } catch (e) {
      if (__DEV__) {
        // tslint:disable-next-line: no-console
        console.warn(e);
      }

      Alert.alert(t(errorAlert.title), t(errorAlert.message));
    }

    Loader.hide();
  };

  render() {
    const {
      navigation: {
        color: { dark, light },
      },
      locale,
    } = this.props;
    const { canBuyDiscount, showBuyAds } = this.state;
    return (
      <View style={styles.container(light)}>
        <StatusBar barStyle='light-content' />
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <LanguagePicker
            dark={dark}
            light={light}
            locale={locale}
            onSelectValue={this.viewModel.handleSetLocale}
          />
          <ListItem
            label={t(strings.sendSuggestion)}
            onPress={this.viewModel.handleNavigate(RouteName.SendSuggestion)}
          />
          <ListItem
            label={t(strings.about)}
            onPress={this.viewModel.handleNavigate(RouteName.About)}
          />
          {showBuyAds && (
            <ListItem
              label={t(
                canBuyDiscount ? strings.removeAdsDiscount : strings.removeAds,
              )}
              onPress={this.onBuyAdFree}
              style={styles.itemMarginTop}
            />
          )}
          <Dev condition={Config.SHOW_DEV_MENU}>
            <ListItem
              label={t(strings.devMenu)}
              onPress={this.viewModel.handleNavigate(RouteName.DevMenu)}
              style={styles.itemMarginTop}
            />
          </Dev>
        </ScrollView>
        <AdBanner adUnitID={AdIds.settingsBottomBanner} />
      </View>
    );
  }
}

const Enhanced = compose(
  withAds,
  withLocale,
)(Settings);

export default withDoneButton(Enhanced, ({ navigation }) => navigation.dismiss);
