import { Platform } from 'react-native';
import { AdMobBanner, AdMobInterstitial } from 'react-native-admob';

const AdIds = Platform.select({
  android: {
    about: 'ca-app-pub-3166606200488630/6961200221',
    homeBottomBanner: 'ca-app-pub-3166606200488630/4628621329',
    homeTopBanner: 'ca-app-pub-3166606200488630/7446356351',
    licenses: 'ca-app-pub-3166606200488630/3896053180',
    phrasesInterstitial: 'ca-app-pub-3166606200488630/4245477945',
    rewarded: 'ca-app-pub-3166606200488630/8120141755',
    sendSuggestionBottomBanner: 'ca-app-pub-3166606200488630/6871641282',
    settingsBottomBanner: 'ca-app-pub-3166606200488630/8376294647',
  },
  ios: {
    about: 'ca-app-pub-3166606200488630/3677148063',
    homeBottomBanner: 'ca-app-pub-3166606200488630/1078897744',
    homeTopBanner: 'ca-app-pub-3166606200488630/6109423644',
    licenses: 'ca-app-pub-3166606200488630/7982514149',
    phrasesInterstitial: 'ca-app-pub-3166606200488630/7403922502',
    rewarded: 'ca-app-pub-3166606200488630/5229544095',
    sendSuggestionBottomBanner: 'ca-app-pub-3166606200488630/5095617078',
    settingsBottomBanner: 'ca-app-pub-3166606200488630/3695013296',
  },
});

export const BannerTestIds = __DEV__
  ? [AdMobBanner.simulatorId, '7390EF66B0FC00613A785C98A5DBBDDB']
  : [];

export class AdManager {
  isLoadingAd = false;
  adRequest: Promise<void> | undefined;

  constructor() {
    if (__DEV__) {
      AdMobInterstitial.setTestDevices([
        AdMobInterstitial.simulatorId,
        '7390EF66B0FC00613A785C98A5DBBDDB',
      ]);
    }
  }

  setAdUnitId = (unitId: string) => {
    AdMobInterstitial.setAdUnitID(unitId);
  };

  isReady = async () =>
    new Promise<boolean>(res => AdMobInterstitial.isReady(res));

  requestAdIfNeeded = async () => {
    this.adRequest = Promise.resolve();
    // const isReady = await this.isReady();
    // if (!isReady && !this.isLoadingAd) {
    //   this.isLoadingAd = true;
    //   this.adRequest = AdMobInterstitial.requestAd();
    //   this.adRequest!.then(() => {
    //     this.isLoadingAd = false;
    //   }).catch();
    // }

    await this.adRequest;
  };

  showAd = async () => {
    // if (this.isLoadingAd) {
    //   await this.adRequest;
    // }
    // const isReady = await this.isReady();
    // if (isReady) {
    //   await AdMobInterstitial.showAd();
    // }
  };
}

export const InterstitialAd = new AdManager();

export default AdIds;
