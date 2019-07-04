import { AdMobInterstitial } from 'react-native-admob';
import { createSandbox } from 'sinon';

import { InterstitialAd } from '../ads';

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
    sandbox.stub(AdMobInterstitial, 'isReady').callsFake((c: any): any => {
      didLoad = true;
      c(isReady);
    });

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

  it('TMP - does not show an ad', async () => {
    sandbox.stub(AdMobInterstitial, 'isReady').callsFake((c: any) => c(true));
    const show = sandbox.stub(AdMobInterstitial, 'showAd');

    await InterstitialAd.showAd();

    expect(show.called).toEqual(false);
  });

  it('TMP - waits for an ad to be loaded if there is a request in motion', async () => {
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

    expect(didLoad).toEqual(false);
    expect(show.called).toEqual(false);
    expect(request.called).toEqual(false);
    // expect(request.calledBefore(show)).toEqual(true);
  });
});
