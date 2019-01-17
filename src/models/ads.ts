import { Platform } from 'react-native';
import { AdMobBanner, AdMobInterstitial } from 'react-native-admob';

const AdIds = Platform.select({
  android: {
    homeBottomBanner: 'ca-app-pub-3166606200488630/4628621329',
    homeTopBanner: 'ca-app-pub-3166606200488630/7446356351',
    phrasesInterstitial: 'ca-app-pub-3166606200488630/4245477945',
    sendSuggestionBottomBanner: 'ca-app-pub-3166606200488630/6871641282',
    settingsBottomBanner: 'ca-app-pub-3166606200488630/8376294647',
  },
  ios: {
    homeBottomBanner: 'ca-app-pub-3166606200488630/1078897744',
    homeTopBanner: 'ca-app-pub-3166606200488630/6109423644',
    phrasesInterstitial: 'ca-app-pub-3166606200488630/7403922502',
    sendSuggestionBottomBanner: 'ca-app-pub-3166606200488630/5095617078',
    settingsBottomBanner: 'ca-app-pub-3166606200488630/3695013296',
  },
});

export const BannerTestIds = __DEV__
  ? [AdMobBanner.simulatorId, '92C9DAEF6B2CB164ABBAEA44A039E9D2']
  : [];

export const onFailToLoadAd = (e: Error) => {
  if (__DEV__) {
    // tslint:disable-next-line: no-console
    console.warn(e);
  }
};

class AdManager {
  isLoadingAd = false;
  adRequest: Promise<void> | undefined;

  constructor() {
    if (__DEV__) {
      AdMobInterstitial.setTestDevices([
        AdMobInterstitial.simulatorId,
        '92C9DAEF6B2CB164ABBAEA44A039E9D2',
      ]);
    }
  }

  setAdUnitId = (unitId: string) => {
    AdMobInterstitial.setAdUnitID(unitId);
  };

  isReady = async () =>
    new Promise<boolean>(res => AdMobInterstitial.isReady(res));

  requestAdIfNeeded = async () => {
    const isReady = await this.isReady();
    if (!isReady && !this.isLoadingAd) {
      this.isLoadingAd = true;
      this.adRequest = AdMobInterstitial.requestAd();
      this.adRequest!.then(() => {
        this.isLoadingAd = false;
      }).catch();
    }

    await this.adRequest;
  };

  showAd = async () => {
    if (this.isLoadingAd) {
      await this.adRequest;
    }

    const isReady = await this.isReady();
    if (isReady) {
      await AdMobInterstitial.showAd();
    }
  };
}

export const InterstitialAd = new AdManager();

export default AdIds;
