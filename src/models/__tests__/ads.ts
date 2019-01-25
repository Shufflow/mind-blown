import { AdMobInterstitial, AdMobRewarded } from 'react-native-admob';
import { createSandbox } from 'sinon';

import AdIds, { InterstitialAd, AdManager } from '../ads';

const sandbox = createSandbox();
afterEach(() => {
  InterstitialAd.isLoadingAd = false;
  InterstitialAd.adRequest = undefined;
  sandbox.restore();
});

describe('constructor', () => {
  it('registers adClosed listener', () => {
    const event = sandbox.stub(AdMobRewarded, 'addEventListener');

    const obj = new AdManager();

    expect(event.calledWith('adClosed', obj.requestRewardedAd)).toEqual(true);
  });

  it('reloads rewarded video on close', () => {
    const event = sandbox.stub(AdMobRewarded, 'addEventListener');
    const request = sandbox.stub(AdMobRewarded, 'requestAd').resolves();

    new AdManager();
    event.callArg(1);

    expect(event.called).toEqual(true);
    expect(request.callCount).toEqual(2);
  });
});

describe('set ad unit id', () => {
  const id = '1234';
  const unitId = sandbox.stub(AdMobInterstitial, 'setAdUnitID');

  InterstitialAd.setAdUnitId(id);

  expect(unitId.calledWith(id)).toEqual(true);
});

describe('is ready', () => {
  it('transforms callback into promise', async () => {
    let didLoad = false;
    const isReady = true;
    sandbox.stub(AdMobInterstitial, 'isReady').callsFake(
      (c: any): any => {
        didLoad = true;
        c(isReady);
      },
    );

    const result = await InterstitialAd.isReady();

    expect(didLoad).toEqual(true);
    expect(result).toEqual(isReady);
  });
});

describe('load ads', () => {
  it('does not load if ad is ready', async () => {
    sandbox.stub(AdMobInterstitial, 'isReady').callsFake((c: any) => c(true));
    const request = sandbox.stub(AdMobInterstitial, 'requestAd');

    await InterstitialAd.requestAdIfNeeded();

    expect(request.called).toEqual(false);
  });

  it('does not load if there is another ad being loaded', async () => {
    sandbox.stub(AdMobInterstitial, 'isReady').callsFake((c: any) => c(false));
    const request = sandbox.stub(AdMobInterstitial, 'requestAd');

    InterstitialAd.requestAdIfNeeded();
    InterstitialAd.requestAdIfNeeded();

    expect(request.calledOnce).toEqual(false);
  });
});

describe('show ad', () => {
  it('does not show if ad is not loaded', async () => {
    sandbox.stub(AdMobInterstitial, 'isReady').callsFake((c: any) => c(false));
    const show = sandbox.stub(AdMobInterstitial, 'showAd');

    await InterstitialAd.showAd();

    expect(show.called).toEqual(false);
  });

  it('shows an ad if it is ready', async () => {
    sandbox.stub(AdMobInterstitial, 'isReady').callsFake((c: any) => c(true));
    const show = sandbox.stub(AdMobInterstitial, 'showAd');

    await InterstitialAd.showAd();

    expect(show.called).toEqual(true);
  });

  it('waits for an ad to be loaded if there is a request in motion', async () => {
    let didLoad = false;
    const firstReady = Promise.resolve(false);
    sandbox
      .stub(InterstitialAd, 'isReady')
      .onFirstCall()
      .returns(firstReady)
      .onSecondCall()
      .resolves(true as any);
    const show = sandbox.stub(AdMobInterstitial, 'showAd');
    const request = sandbox
      .stub(AdMobInterstitial, 'requestAd')
      .callsFake(async () => {
        didLoad = true;
        return Promise.resolve();
      });

    InterstitialAd.requestAdIfNeeded();
    await firstReady;
    await InterstitialAd.showAd();

    expect(didLoad).toEqual(true);
    expect(show.called).toEqual(true);
    expect(request.called).toEqual(true);
    expect(request.calledBefore(show)).toEqual(true);
  });
});

describe('request rewarded ad', () => {
  it('requests an ad with the correct id', () => {
    sandbox.stub(AdMobRewarded, 'requestAd').resolves();
    const id = sandbox.stub(AdMobRewarded, 'setAdUnitID');

    InterstitialAd.requestRewardedAd();

    expect(id.calledWith(AdIds.rewarded)).toEqual(true);
  });

  it('requests an ad', () => {
    sandbox.stub(AdMobRewarded, 'setAdUnitID');
    const req = sandbox.stub(AdMobRewarded, 'requestAd').resolves();

    InterstitialAd.requestRewardedAd();

    expect(req.called).toEqual(true);
  });

  it('silences any errors', () => {
    sandbox.stub(AdMobRewarded, 'setAdUnitID');
    const req = sandbox.stub(AdMobRewarded, 'requestAd').rejects();

    expect(InterstitialAd.requestRewardedAd).not.toThrow();

    expect(req.called).toEqual(true);
  });
});

describe('show rewarded ad', () => {
  it('shows an ad', () => {
    const show = sandbox.stub(AdMobRewarded, 'showAd');

    InterstitialAd.showRewardedAd();

    expect(show.called).toEqual(true);
  });

  it('registers an rewarded event', () => {
    sandbox.stub(AdMobRewarded, 'showAd');
    const event = sandbox.stub(AdMobRewarded, 'addEventListener');

    InterstitialAd.showRewardedAd();

    expect(event.calledWithMatch('rewarded')).toEqual(true);
  });

  it('resolves when reward is given', async () => {
    sandbox.stub(AdMobRewarded, 'showAd');
    const event = sandbox.stub(AdMobRewarded, 'addEventListener');

    const promise = InterstitialAd.showRewardedAd();
    event.callArg(1);

    await promise;

    expect(event.called).toEqual(true);
  });
});

describe('handle rewarded video completed', () => {
  it('calls resolve', () => {
    sandbox.stub(AdMobRewarded, 'removeEventListener');
    const func = sandbox.stub();

    InterstitialAd.handleRewardedVideoCompleted(func)();

    expect(func.called).toEqual(true);
  });

  it('removes the registered listener', () => {
    const event = sandbox.stub(AdMobRewarded, 'removeEventListener');
    const func = sandbox.stub();

    InterstitialAd.handleRewardedVideoCompleted(func)();

    expect(event.calledWithMatch('rewarded')).toEqual(true);
  });

  it('calls callback handler', () => {
    sandbox.stub(AdMobRewarded, 'removeEventListener');
    const func = sandbox.stub();

    InterstitialAd.handleRewardedVideo = func;
    InterstitialAd.handleRewardedVideoCompleted(() => {})();

    expect(func.called).toEqual(true);
  });

  it('does not call callback handler if undefined', () => {
    sandbox.stub(AdMobRewarded, 'removeEventListener');

    InterstitialAd.handleRewardedVideo = () => {};
    const func = sandbox
      .stub(InterstitialAd, 'handleRewardedVideo')
      .value(undefined);

    InterstitialAd.handleRewardedVideoCompleted(() => {})();

    expect(func.called).toEqual(false);
  });
});
