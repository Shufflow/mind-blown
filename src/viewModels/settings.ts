import { Alert, Linking } from 'react-native';

import { LocaleConsumerProps } from 'src/utils/hocs/withLocale';
import { AdsConsumerProps } from 'src/utils/hocs/withAds';
import { ColoredScreenProps } from 'src/navigators/SettingsNavigator/types';
import t, { AdDiscountAlert as strings } from 'src/locales';

import IAP, { IAPErrorCodes } from 'src/models/iap';
import { InterstitialAd } from 'src/models/ads';

interface Props
  extends LocaleConsumerProps,
    ColoredScreenProps,
    AdsConsumerProps {}

class SettingsViewModel {
  props: Props;
  showBuyAds: boolean;
  canBuyDiscount = false;
  enableBuyDiscount: () => void;

  constructor(props: Props, enableBuyDiscount: () => void) {
    this.props = props;
    this.showBuyAds = props.showAds && IAP.canBuyAdFree;
    this.enableBuyDiscount = enableBuyDiscount;
  }

  handleNavigate = (routeName: string) => () => {
    const { dark, light } = this.props.navigation.color;
    this.props.navigation.navigate(routeName, { dark, light });
  };

  handleBuyAdFree = async () => {
    if (this.canBuyDiscount) {
      await IAP.buyAdFreeDiscount();
    } else {
      await this.buyAdFree();
    }
  };

  handleOpenURL = (url: string) => async () => Linking.openURL(url);

  buyAdFree = async () => {
    try {
      await IAP.buyAdFree();
    } catch (e) {
      if (e.code === IAPErrorCodes.cancelled && IAP.canBuyAdsDiscount) {
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
  };

  showRewardedAd = async () => {
    await InterstitialAd.showRewardedAd();
    this.enableBuyDiscount();
    await IAP.buyAdFreeDiscount();
  };
}

export default SettingsViewModel;
