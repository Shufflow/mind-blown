import React from 'react';
import { View, StatusBar, Linking, ScrollView } from 'react-native';
import Config from 'react-native-config';

import { LocaleConsumerProps, withLocale } from 'src/utils/hocs/withLocale';
import { AdsConsumerProps, withAds } from 'src/utils/hocs/withAds';
import Constants from 'src/utils/constants';

import AdIds from 'src/models/ads';
import IAP from 'src/models/iap';
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

interface Props
  extends LocaleConsumerProps,
    ColoredScreenProps,
    AdsConsumerProps {}

interface State {
  showBuyAds: boolean;
}

class Settings extends React.Component<Props, State> {
  state = {
    showBuyAds: false,
  };

  async componentDidMount() {
    this.setState({
      showBuyAds: !this.props.showAds && IAP.canBuyAdFree,
    });
  }

  navigate = (routeName: string) => () => {
    const { dark, light } = this.props.navigation.color;
    this.props.navigation.navigate(routeName, { dark, light });
  };

  openURL = (url: string) => async () => Linking.openURL(url);

  buyAdFree = async () => {
    try {
      await IAP.buyAdFree();
      this.props.checkShowAds();
    } catch (e) {
      // TODO
    }
  };

  render() {
    const {
      navigation: {
        color: { dark, light },
      },
      locale,
      setLocale,
    } = this.props;
    return (
      <View style={styles.container(light)}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <StatusBar barStyle='light-content' />
          <LanguagePicker
            dark={dark}
            light={light}
            locale={locale}
            onSelectValue={setLocale}
          />
          <ListItem
            label={t(strings.sendSuggestion)}
            onPress={this.navigate(routeNames.SendSuggestion)}
          />
          <ListItem
            label={t(strings.licenses)}
            onPress={this.navigate(routeNames.Licenses)}
          />
          {this.state.showBuyAds && (
            <ListItem
              label={t(strings.removeAds)}
              onPress={this.buyAdFree}
              style={styles.itemMarginTop}
            />
          )}
          <Dev condition={Config.SHOW_DEV_MENU}>
            <ListItem
              label={t(strings.devMenu)}
              onPress={this.navigate(routeNames.DevMenu)}
              style={styles.itemMarginTop}
            />
          </Dev>
          <View style={styles.footerContainer}>
            <Button
              hasShadow={false}
              theme={ButtonTheme.minimalist}
              onPress={this.openURL(Constants.repoURL)}
              style={styles.footerLink}
              textStyle={styles.footerLinkText}
            >
              {t(strings.madeBy)}
            </Button>
            <Button
              hasShadow={false}
              theme={ButtonTheme.minimalist}
              onPress={this.openURL(Constants.agnesURL)}
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
