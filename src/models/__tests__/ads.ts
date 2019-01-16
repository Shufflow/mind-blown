import { AdMobInterstitial } from 'react-native-admob';
import { createSandbox } from 'sinon';

import { InterstitialAd, onFailToLoadAd } from '../ads';

const sandbox = createSandbox();
afterEach(() => {
  InterstitialAd.isLoadingAd = false;
  InterstitialAd.adRequest = undefined;
  sandbox.restore();
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

describe('on fail to load ad', () => {
  it('calls console on dev', () => {
    const cons = sandbox.stub(console, 'warn');
    (__DEV__ as any) = true;

    const error = new Error('foobar');
    onFailToLoadAd(error);

    expect(cons.calledWith(error)).toEqual(true);
  });

  it('does not call console on release', () => {
    const cons = sandbox.stub(console, 'warn');
    (__DEV__ as any) = false;

    onFailToLoadAd(new Error('foobar'));

    expect(cons.called).toEqual(false);
  });
});
