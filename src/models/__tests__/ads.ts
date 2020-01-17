import {
  InterstitialAd as AdMobInterstitial,
  AdEventType,
} from '@react-native-firebase/admob';
import { createSandbox, assert } from 'sinon';

import { InterstitialAd } from '../ads';

let show: sinon.SinonStub;
let sendEvent: sinon.SinonStub;
let load: sinon.SinonStub;
let unsubscribe: sinon.SinonStub;
let create: sinon.SinonStub;
const sandbox = createSandbox();
afterEach(sandbox.restore);

beforeEach(() => {
  unsubscribe = sandbox.stub();
  sendEvent = sandbox.stub().returns(unsubscribe);
  load = sandbox.stub();
  show = sandbox.stub().resolves();
  create = sandbox.stub(AdMobInterstitial, 'createForAdRequest').returns({
    load,
    show,
    onAdEvent: sendEvent,
  } as any);
});

it('set ad unit id', () => {
  const id = '1234';

  (__DEV__ as any) = false;
  new InterstitialAd(id);

  assert.calledWithExactly(create, id);
});

describe('request ad if needed', () => {
  it('does not load if ad is ready', async () => {
    sendEvent.callsArgWith(0, AdEventType.LOADED);

    const manager = new InterstitialAd('');
    await manager.requestAdIfNeeded();

    load.reset();
    await manager.requestAdIfNeeded();

    assert.notCalled(load);
    assert.notCalled(unsubscribe);
  });

  it('does not load if there is another ad being loaded', async () => {
    const manager = new InterstitialAd('');

    const request = manager.requestAdIfNeeded();
    sendEvent.callArgWith(0, AdEventType.LOADED);
    await request;

    assert.calledOnce(load);
    assert.notCalled(unsubscribe);
  });

  it('rejects if request fails', async () => {
    const error = new Error('error');
    sendEvent.callsArgWith(0, AdEventType.ERROR, error);

    const manager = new InterstitialAd('');

    try {
      await manager.requestAdIfNeeded();
      fail('should have thrown error');
    } catch (e) {
      expect(e).toBe(error);
    }

    assert.notCalled(unsubscribe);
  });
});

describe('show ad', () => {
  let manager: InterstitialAd;

  beforeEach(() => {
    manager = new InterstitialAd('');
  });

  it('does not show if ad is not loaded', async () => {
    sendEvent.callArgWith(0, AdEventType.LOADED);
    sandbox.stub(manager, 'isReady').returns(false);

    await manager.showAd();

    assert.notCalled(show);
  });

  it('shows an ad if it is ready', async () => {
    sendEvent.callArgWith(0, AdEventType.LOADED);
    sandbox.stub(manager, 'isReady').returns(true);

    await manager.showAd();

    assert.calledOnce(show);
  });

  it('waits for an ad to be loaded if there is a request in motion', async () => {
    sandbox
      .stub(manager, 'isReady')
      .returns(true)
      .onFirstCall()
      .returns(false);

    const showPromise = manager.showAd();
    assert.notCalled(show);

    sendEvent.callArgWith(0, AdEventType.LOADED);
    await showPromise;

    assert.calledOnce(show);
    assert.calledOnce(load);
  });
});
