import React from 'react';
import { View, StatusBar, ScrollView } from 'react-native';
import Config from 'react-native-config';

import { LocaleConsumerProps, withLocale } from 'src/utils/hocs/withLocale';
import { AdsConsumerProps, withAds } from 'src/utils/hocs/withAds';
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
import { compose } from '@typed/compose';
import SettingsViewModel, { State, Props } from 'src/viewModels/settings';

class Settings extends React.Component<Props, State> {
  viewModel: SettingsViewModel;

  constructor(props: Props) {
    super(props);
    this.viewModel = new SettingsViewModel(
      props,
      state => {
        this.setState(state);
      },
      () => this.state,
    );
    this.state = this.viewModel.getInitialState(props);
  }

  render() {
    const {
      navigation: {
        color: { dark, light },
      },
      locale,
    } = this.props;
    const { canBuyDiscount } = this.state;
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
              onPress={this.viewModel.handleNavigate(routeNames.SendSuggestion)}
            />
            <ListItem
              label={t(strings.licenses)}
              onPress={this.viewModel.handleNavigate(routeNames.Licenses)}
            />
            {this.viewModel.showBuyAds && (
              <ListItem
                label={t(
                  canBuyDiscount
                    ? strings.removeAdsDiscount
                    : strings.removeAds,
                )}
                onPress={this.viewModel.handleBuyAdFree}
                style={styles.itemMarginTop}
              />
            )}
            <Dev condition={Config.SHOW_DEV_MENU}>
              <ListItem
                label={t(strings.devMenu)}
                onPress={this.viewModel.handleNavigate(routeNames.DevMenu)}
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
