import { createSandbox, assert } from 'sinon';
import {
  RewardedAd,
  AdEventType,
  RewardedAdEventType,
} from '@react-native-firebase/admob';

import RewardedAdManager from '../rewardedAd';

const sandbox = createSandbox();
let show: sinon.SinonStub;
let sendEvent: sinon.SinonStub;
let load: sinon.SinonStub;
let unsubscribe: sinon.SinonStub;
let create: sinon.SinonStub;
let manager: RewardedAdManager;
beforeEach(() => {
  unsubscribe = sandbox.stub();
  sendEvent = sandbox.stub().returns(unsubscribe);
  load = sandbox.stub();
  show = sandbox.stub().resolves();
  create = sandbox.stub(RewardedAd, 'createForAdRequest').returns({
    load,
    show,
    onAdEvent: sendEvent,
  } as any);
  manager = new RewardedAdManager('');
});
afterEach(sandbox.restore);

describe('constructor', () => {
  it('sends the given id', () => {
    const id = 'id';

    (__DEV__ as any) = false;
    new RewardedAdManager(id);

    assert.calledWithExactly(create, id);
  });

  it('registers adClosed listener', () => {
    const request = sandbox.stub(manager, 'requestAdIfNeeded');

    sendEvent.yield(AdEventType.CLOSED);

    assert.calledOnce(request);
  });
});

describe('request ad', () => {
  it('request a rewarded ad', async () => {
    sendEvent.yields(RewardedAdEventType.LOADED);

    await manager.requestAdIfNeeded();

    assert.calledOnce(load);
  });

  it('throws if request fails', async () => {
    const error = new Error('fail');
    sendEvent.yields(AdEventType.ERROR, error);

    try {
      await manager.requestAdIfNeeded();
      fail('should have thrown error');
    } catch (e) {
      expect(e).toEqual(error);
    }

    assert.calledOnce(load);
  });

  it('does not request if is ready', async () => {
    sendEvent.yields(RewardedAdEventType.LOADED);
    sandbox
      .stub(manager, 'isReady')
      .returns(true)
      .onFirstCall()
      .returns(false);

    await manager.requestAdIfNeeded();
    await manager.requestAdIfNeeded();

    assert.calledOnce(load);
  });

  it('does not request if is loading', async () => {
    sendEvent.yields(RewardedAdEventType.LOADED);
    sandbox
      .stub(manager, 'isReady')
      .returns(true)
      .onFirstCall()
      .returns(false);

    await manager.requestAdIfNeeded();

    load.reset();
    await manager.requestAdIfNeeded();

    assert.notCalled(load);
    assert.notCalled(unsubscribe);
  });

  it('unsubscribes from event when request finishes', async () => {
    const request = manager.requestAdIfNeeded();
    sendEvent.yield(RewardedAdEventType.LOADED);
    await request;

    assert.calledOnce(unsubscribe);
  });
});

describe('show ad', () => {
  it('is ready', async () => {
    sandbox.stub(manager, 'isReady').returns(true);

    setImmediate(() => {
      sendEvent.yield(RewardedAdEventType.EARNED_REWARD);
    });
    await manager.showAd();

    assert.calledOnce(show);
    assert.calledOnce(unsubscribe);
  });

  it('is not ready', async () => {
    await manager.showAd();

    assert.notCalled(show);
  });

  it('waits for the ad to load', async () => {
    manager.requestAdIfNeeded();

    const showPromise = manager.showAd();
    assert.notCalled(show);

    sandbox.stub(manager, 'isReady').returns(true);
    sendEvent.yields(RewardedAdEventType.EARNED_REWARD);
    sendEvent.yield(RewardedAdEventType.LOADED);

    await showPromise;

    assert.calledOnce(show);
    assert.calledOnce(load);
  });

  it('resolves when reward is given', async () => {
    sandbox.stub(manager, 'isReady').returns(true);
    let resolved = false;

    const promise = manager.showAd();

    expect(resolved).toEqual(false);
    setImmediate(() => {
      sendEvent.yield(RewardedAdEventType.EARNED_REWARD);
    });

    promise.then(() => {
      resolved = true;
    });

    await promise;

    expect(resolved).toEqual(true);
  });

  it('unsubscribes from listener if new request is made', () => {
    sandbox.stub(manager, 'isReady').returns(true);

    manager.showAd();
    manager.showAd();

    assert.calledOnce(unsubscribe);
  });

  it('ignores unexpected events', async () => {
    const error = new Error('error');
    sandbox.stub(manager, 'isReady').returns(true);

    setImmediate(() => {
      sendEvent.yield(RewardedAdEventType.LOADED);
      sendEvent.yield(AdEventType.ERROR, error);
    });

    try {
      await manager.showAd();
      fail('should have thrown error');
    } catch (e) {
      expect(e).toBe(error);
    }
  });
});
