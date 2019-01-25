import { Platform } from 'react-native';
import {
  AdMobBanner,
  AdMobInterstitial,
  AdMobRewarded,
} from 'react-native-admob';

const AdIds = Platform.select({
  android: {
    homeBottomBanner: 'ca-app-pub-3166606200488630/4628621329',
    homeTopBanner: 'ca-app-pub-3166606200488630/7446356351',
    phrasesInterstitial: 'ca-app-pub-3166606200488630/4245477945',
    rewarded: 'ca-app-pub-3166606200488630/8120141755',
    sendSuggestionBottomBanner: 'ca-app-pub-3166606200488630/6871641282',
    settingsBottomBanner: 'ca-app-pub-3166606200488630/8376294647',
  },
  ios: {
    homeBottomBanner: 'ca-app-pub-3166606200488630/1078897744',
    homeTopBanner: 'ca-app-pub-3166606200488630/6109423644',
    phrasesInterstitial: 'ca-app-pub-3166606200488630/7403922502',
    rewarded: 'ca-app-pub-3166606200488630/5229544095',
    sendSuggestionBottomBanner: 'ca-app-pub-3166606200488630/5095617078',
    settingsBottomBanner: 'ca-app-pub-3166606200488630/3695013296',
  },
});

enum RewardedAdEvents {
  adClosed = 'adClosed',
  rewarded = 'rewarded',
}

export const BannerTestIds = __DEV__
  ? [AdMobBanner.simulatorId, '7390EF66B0FC00613A785C98A5DBBDDB']
  : [];

export class AdManager {
  isLoadingAd = false;
  adRequest: Promise<void> | undefined;
  handleRewardedVideo: (() => void) | undefined;

  constructor() {
    if (__DEV__) {
      AdMobInterstitial.setTestDevices([
        AdMobInterstitial.simulatorId,
        '7390EF66B0FC00613A785C98A5DBBDDB',
      ]);
      AdMobRewarded.setTestDevices([
        AdMobRewarded.simulatorId,
        '7390EF66B0FC00613A785C98A5DBBDDB',
      ]);
    }

    AdMobRewarded.addEventListener(
      RewardedAdEvents.adClosed,
      this.requestRewardedAd,
    );
    this.requestRewardedAd();
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

  requestRewardedAd = () => {
    AdMobRewarded.setAdUnitID(AdIds.rewarded);
    AdMobRewarded.requestAd().catch(() => {});
  };

  handleRewardedVideoCompleted = (resolve: () => void) => () => {
    resolve();

    if (this.handleRewardedVideo) {
      this.handleRewardedVideo();
    }

    AdMobRewarded.removeEventListener(
      RewardedAdEvents.rewarded,
      this.handleRewardedVideoCompleted(resolve),
    );
  };

  showRewardedAd = async () => {
    return new Promise<void>(resolve => {
      AdMobRewarded.addEventListener(
        RewardedAdEvents.rewarded,
        this.handleRewardedVideoCompleted(resolve),
      );
      AdMobRewarded.showAd();
    });
  };
}

export const InterstitialAd = new AdManager();

export default AdIds;
