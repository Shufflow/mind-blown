import {
  RewardedAd as AdMobRewarded,
  TestIds,
  FirebaseAdMobTypes,
  AdEventType,
  RewardedAdEventType,
} from '@react-native-firebase/admob';

class RewardedAd {
  private adRequest?: Promise<void>;
  private eventsSubscription: { [key: string]: Function } = {};
  private ad: FirebaseAdMobTypes.RewardedAd;

  constructor(id: string) {
    this.ad = AdMobRewarded.createForAdRequest(__DEV__ ? TestIds.REWARDED : id);
    this.eventsSubscription[AdEventType.CLOSED] = this.ad.onAdEvent(type => {
      if (type === AdEventType.CLOSED) {
        this.requestAdIfNeeded();
      }
    });
  }

  isReady = () => this.ad.loaded;

  requestAdIfNeeded = async () => {
    if (this.isReady() || this.adRequest) {
      return this.adRequest;
    }

    this.adRequest = this.eventToPromise(RewardedAdEventType.LOADED);
    this.ad.load();
    return this.adRequest;
  };

  showAd = async () => {
    if (!this.isReady() && this.adRequest) {
      await this.adRequest;
    }

    if (this.isReady()) {
      const reward = this.eventToPromise(RewardedAdEventType.EARNED_REWARD);
      await this.ad.show();
      return reward;
    }
  };

  private eventToPromise = async (event: any): Promise<void> => {
    if (this.eventsSubscription[event]) {
      this.eventsSubscription[event]();
    }

    return new Promise<void>((resolve, reject) => {
      const unsubscribe = this.ad.onAdEvent((type, error) => {
        switch (type) {
          case event:
            resolve();
            break;

          case AdEventType.ERROR:
            reject(error);
            break;

          default:
            return;
        }

        unsubscribe();
        delete this.eventsSubscription[event];
      });

      this.eventsSubscription[event] = unsubscribe;
    });
  };
}

export default RewardedAd;
