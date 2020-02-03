import { Platform } from 'react-native';
import {
  InterstitialAd as AdMobInterstitial,
  TestIds,
  FirebaseAdMobTypes,
  AdEventType,
  AdsConsent,
} from '@react-native-firebase/admob';
AdsConsent.addTestDevices(['7390EF66B0FC00613A785C98A5DBBDDB']);

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
})!;

export class InterstitialAd {
  private requestAd?: Promise<void>;
  private interstitialAd: FirebaseAdMobTypes.InterstitialAd;

  constructor(id: string) {
    this.interstitialAd = AdMobInterstitial.createForAdRequest(
      __DEV__ ? TestIds.INTERSTITIAL : id,
    );

    this.requestAdIfNeeded();
  }

  isReady = () => this.interstitialAd.loaded;

  requestAdIfNeeded = async (): Promise<void> => {
    if (this.isReady() || this.requestAd) {
      return this.requestAd;
    }

    this.requestAd = new Promise<void>((resolve, reject) => {
      this.interstitialAd.onAdEvent((type, error) => {
        switch (type) {
          case AdEventType.LOADED:
            resolve();
            break;

          case AdEventType.ERROR:
            reject(error);
            break;
        }
      });
    });

    this.interstitialAd.load();
    return this.requestAd;
  };

  showAd = async () => {
    if (!this.isReady() && this.requestAd) {
      await this.requestAd;
    }

    if (this.isReady()) {
      await this.interstitialAd.show();
    }
  };
}

export default AdIds;
