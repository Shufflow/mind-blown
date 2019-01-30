import { Alert, Linking } from 'react-native';

import { LocaleConsumerProps } from 'src/utils/hocs/withLocale';
import { AdsConsumerProps } from 'src/utils/hocs/withAds';
import { ColoredScreenProps } from 'src/navigators/SettingsNavigator/types';
import t, { AdDiscountAlert as strings } from 'src/locales';

import IAP, { IAPErrorCodes } from 'src/models/iap';
import AdIds from 'src/models/ads';

import { ViewModel } from 'src/components/SmartComponent';
import RewardedAd from 'src/models/rewardedAd';

export interface Props
  extends LocaleConsumerProps,
    ColoredScreenProps,
    AdsConsumerProps {}

export interface State {
  canBuyDiscount: boolean;
}

class SettingsViewModel extends ViewModel<Props, State> {
  showBuyAds: boolean;

  constructor(
    props: Props,
    getState: () => State,
    setState: (state: State) => void,
  ) {
    super(props, getState, setState);
    this.showBuyAds = props.showAds && IAP.canBuyAdFree;

    RewardedAd.setAdUnitId(AdIds.rewarded);
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
    let loadRewardedAd: Promise<void> = Promise.reject();
    try {
      loadRewardedAd = RewardedAd.requestAdIfNeeded();
      return await IAP.buyAdFree();
    } catch (e) {
      try {
        if (e.code === IAPErrorCodes.cancelled && IAP.canBuyAdsDiscount) {
          await loadRewardedAd;
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
      } catch (e2) {
        if (__DEV__) {
          // tslint:disable-next-line: no-console
          console.warn(e2);
        }
      }
    }

    return false;
  };

  showRewardedAd = async () => {
    await RewardedAd.showAd();
    this.setState({ canBuyDiscount: true });
    await IAP.buyAdFreeDiscount();
  };
}

export default SettingsViewModel;
