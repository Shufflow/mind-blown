import { Alert, Linking } from 'react-native';

import { LocaleConsumerProps } from 'src/utils/hocs/withLocale';
import { AdsConsumerProps } from 'src/utils/hocs/withAds';
import sleep from 'src/utils/sleep';
import { ColoredScreenProps } from 'src/navigators/SettingsNavigator/types';
import t, { AdDiscountAlert as strings } from 'src/locales';

import IAP, { IAPErrorCodes } from 'src/models/iap';
import { InterstitialAd } from 'src/models/ads';

const Constants = {
  alertTimeout: 500,
};

export interface Props
  extends LocaleConsumerProps,
    ColoredScreenProps,
    AdsConsumerProps {}

export interface State {
  canBuyDiscount: boolean;
}

class SettingsViewModel {
  props: Props;
  showBuyAds: boolean;

  updateState: (state: State) => void;
  getState: () => State;

  constructor(
    props: Props,
    updateState: (state: State) => void,
    getState: () => State,
  ) {
    this.props = props;
    this.showBuyAds = props.showAds && IAP.canBuyAdFree;
    this.updateState = updateState;
    this.getState = getState;
  }

  getInitialState = (props: Props): State => ({
    canBuyDiscount: false,
  });

  handleNavigate = (routeName: string) => () => {
    const { dark, light } = this.props.navigation.color;
    this.props.navigation.navigate(routeName, { dark, light });
  };

  handleBuyAdFree = async () => {
    const result = this.getState().canBuyDiscount
      ? await IAP.buyAdFreeDiscount()
      : await this.buyAdFree();

    if (result) {
      this.props.checkShowAds();
    }
  };

  handleOpenURL = (url: string) => async () => Linking.openURL(url);

  handleSetLocale = (locale: string) => {
    this.props.setLocale(locale);
    this.props.navigation.setParams({ updateLocale: '' });
  };

  // Private Methods

  buyAdFree = async () => {
    try {
      return await IAP.buyAdFree();
    } catch (e) {
      if (e.code === IAPErrorCodes.cancelled && IAP.canBuyAdsDiscount) {
        await sleep(Constants.alertTimeout);
        Alert.alert(t(strings.title), t(strings.message), [
          {
            style: 'cancel',
            text: t(strings.cancel),
          },
          {
            onPress: this.showRewardedAd,
            text: t(strings.confirm),
          },
        ]);
      }
    }

    return false;
  };

  showRewardedAd = async () => {
    await InterstitialAd.showRewardedAd();
    this.updateState({ canBuyDiscount: true });
    await IAP.buyAdFreeDiscount();
  };
}

export default SettingsViewModel;
