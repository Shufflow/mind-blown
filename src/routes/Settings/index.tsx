import React from 'react';
import { View, StatusBar, ScrollView, Alert } from 'react-native';
import Config from 'react-native-config';
import { compose } from '@typed/compose';

import t, {
  Settings as strings,
  Global as globalStrings,
  AdFreeErrorAlert as errorAlert,
} from '@locales';
import RouteName from '@routes';
import { withLocale } from '@hocs/withLocale';
import { withAds } from '@hocs/withAds';
import Constants from '@utils/constants';

import Dev from '@components/Dev';
import ListItem from '@components/ListItem';
import HeaderButton from '@components/HeaderButton';
import AdBanner from '@components/AdBanner';
import Button, { ButtonTheme } from '@components/Button';
import SmartComponent from '@components/SmartComponent';

import AdIds from 'src/models/ads';

import SettingsViewModel, { State, Props } from 'src/viewModels/settings';

import LanguagePicker from './components/LanguagePicker';
import styles from './styles';

class Settings extends SmartComponent<Props, State, SettingsViewModel> {
  constructor(props: Props) {
    super(props, SettingsViewModel);
  }

  onBuyAdFree = async () => {
    try {
      await this.viewModel.handleBuyAdFree();
    } catch (e) {
      if (__DEV__) {
        // tslint:disable-next-line: no-console
        console.warn(e);
      }

      Alert.alert(t(errorAlert.title), t(errorAlert.message));
    }
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
          <View>
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
              label={t(strings.licenses)}
              onPress={this.viewModel.handleNavigate(RouteName.Licenses)}
            />
            {showBuyAds && (
              <ListItem
                label={t(
                  canBuyDiscount
                    ? strings.removeAdsDiscount
                    : strings.removeAds,
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
          </View>
          <View style={styles.footerContainer}>
            <Button
              hasShadow={false}
              theme={ButtonTheme.minimalist}
              onPress={this.viewModel.handleOpenURL(Constants.repoURL)}
              style={styles.footerLink}
              textStyle={styles.footerLinkText}
            >
              {t(strings.madeBy)}
            </Button>
            <Button
              hasShadow={false}
              theme={ButtonTheme.minimalist}
              onPress={this.viewModel.handleOpenURL(Constants.agnesURL)}
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
  }
}

const Enhanced = compose(
  withAds,
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
