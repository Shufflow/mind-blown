import { AdMobRewarded } from 'react-native-admob';

enum RewardedAdEvents {
  adClosed = 'adClosed',
  rewarded = 'rewarded',
}

export class RewardedAdManager {
  private isLoadingAd = false;
  private adRequest: Promise<void> | undefined;
  private eventsSubscription: { [key: string]: any } = {};
  private isReady = false;

  constructor() {
    if (__DEV__) {
      AdMobRewarded.setTestDevices([
        AdMobRewarded.simulatorId,
        '7390EF66B0FC00613A785C98A5DBBDDB',
      ]);
    }

    AdMobRewarded.addEventListener(
      RewardedAdEvents.adClosed,
      this.requestAdIfNeeded,
    );
  }

  setAdUnitId = (unitId: string) => {
    AdMobRewarded.setAdUnitID(unitId);
  };

  requestAdIfNeeded = async () => {
    if (!this.isLoadingAd && !this.isReady) {
      this.isLoadingAd = true;
      this.adRequest = AdMobRewarded.requestAd();
      this.adRequest!.then(() => {
        this.isLoadingAd = false;
        this.isReady = true;
      }).catch();
    }

    await this.adRequest;
  };

  showAd = async () => {
    if (this.isLoadingAd) {
      await this.adRequest;
    }

    if (this.isReady) {
      return new Promise<void>(resolve => {
        this.onEvent(RewardedAdEvents.rewarded, resolve);
        this.isReady = false;
        AdMobRewarded.showAd();
      });
    }
  };

  private onEvent = (event: RewardedAdEvents, callback: () => void) => {
    const subscription = AdMobRewarded.addEventListener(event, () => {
      callback();
      subscription.remove();

      delete this.eventsSubscription[event];
    });

    this.eventsSubscription[event] = subscription;
  };
}

export default new RewardedAdManager();
