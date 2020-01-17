import { Alert } from 'react-native';

import t, { AdDiscountAlert as strings } from '@locales';
import { LocaleConsumerProps } from '@hocs/withLocale';
import { AdsConsumerProps } from '@hocs/withAds';
import { ViewModel } from '@components/SmartComponent';

import { ColoredScreenProps } from 'src/navigators/SettingsNavigator/types';

import IAP, { IAPErrorCodes } from 'src/models/iap';
import AdIds from 'src/models/ads';

import RewardedAd from 'src/models/rewardedAd';

export interface Props
  extends LocaleConsumerProps,
    ColoredScreenProps,
    AdsConsumerProps {}

export interface State {
  canBuyDiscount: boolean;
  isAdFree: boolean;
  isIAPAvailable: boolean;
}

class SettingsViewModel extends ViewModel<Props, State> {
  rewardedAd = new RewardedAd(AdIds.rewarded);

  getInitialState = (props: Props): State => ({
    canBuyDiscount: false,
    isAdFree: !props.showAds,
    isIAPAvailable: false,
  });

  init = async () => {
    const isIAPAvailable = await IAP.isAvailable;
    this.setState({
      isIAPAvailable,
    });
  };

  handleNavigate = (routeName: string) => () => {
    const { dark, light } = this.getProps().navigation.color;
    this.getProps().navigation.navigate(routeName, { dark, light });
  };

  handleBuyAdFree = async () => {
    const result = this.getState().canBuyDiscount
      ? await IAP.buyAdFreeDiscount()
      : await this.buyAdFree();

    if (result) {
      await this.processPurchase();
    }
  };

  handleSetLocale = (locale: string) => {
    this.getProps().setLocale(locale);
    this.getProps().navigation.setParams({ updateLocale: '' });
  };

  // Private Methods

  private buyAdFree = async () => {
    let loadRewardedAd: Promise<void> = Promise.reject();
    try {
      loadRewardedAd = this.rewardedAd.requestAdIfNeeded().then(() => {
        this.rewardedAd = new RewardedAd(AdIds.rewarded);
      });
      return await IAP.buyAdFree();
    } catch (e) {
      try {
        if (e.code === IAPErrorCodes.cancelled) {
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
        } else {
          // tslint:disable-next-line: no-console
          console.warn(e);
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

  private showRewardedAd = async () => {
    await this.rewardedAd.showAd();
    this.setState({ canBuyDiscount: true });
    const result = await IAP.buyAdFreeDiscount();
    if (result) {
      await this.processPurchase();
    }
  };

  private processPurchase = async () => {
    const isAdFree = await this.getProps().checkIsAdFree();
    this.setState({ isAdFree });
  };
}

export default SettingsViewModel;
