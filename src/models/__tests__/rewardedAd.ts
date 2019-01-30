import { createSandbox } from 'sinon';
import { AdMobRewarded } from 'react-native-admob';

import { RewardedAdManager } from '../rewardedAd';

const sandbox = createSandbox();
let manager: RewardedAdManager;
beforeEach(() => {
  manager = new RewardedAdManager();
});
afterEach(sandbox.restore);

describe('constructor', () => {
  it('registers adClosed listener', () => {
    const event = sandbox.stub(AdMobRewarded, 'addEventListener');

    const obj = new RewardedAdManager();

    expect(event.calledWith('adClosed', obj.requestAdIfNeeded)).toEqual(true);
  });
});

describe('request ad', () => {
  it('request a rewarded ad', async () => {
    const request = sandbox.stub(AdMobRewarded, 'requestAd').resolves();

    await manager.requestAdIfNeeded();

    expect(request.called).toEqual(true);
  });

  it('throws if request fails', async () => {
    const error = new Error('fail');
    const request = sandbox.stub(AdMobRewarded, 'requestAd').rejects(error);

    try {
      await manager.requestAdIfNeeded();
      fail('should have thrown error');
    } catch (e) {
      expect(e).toEqual(error);
    }

    expect(request.called).toEqual(true);
  });

  it('does not request if is ready', async () => {
    const request = sandbox.stub(AdMobRewarded, 'requestAd').resolves();

    await manager.requestAdIfNeeded();
    await manager.requestAdIfNeeded();

    expect(request.callCount).toEqual(1);
  });

  it('does not request if is loading', async () => {
    const request = sandbox
      .stub(AdMobRewarded, 'requestAd')
      .onFirstCall()
      .returns(
        new Promise<void>(res => {
          setImmediate(res);
        }),
      )
      .resolves();

    manager.requestAdIfNeeded();
    await manager.requestAdIfNeeded();

    expect(request.calledOnce).toEqual(true);
  });
});

describe('show ad', () => {
  it('is ready', async () => {
    sandbox.stub(manager, 'isReady' as any).value(true);
    const showAd = sandbox.stub(AdMobRewarded, 'showAd').resolves();
    const remove = sandbox.stub();
    const event = sandbox
      .stub(AdMobRewarded, 'addEventListener')
      .returns({ remove });

    setImmediate(() => {
      event.callArg(1);
    });
    await manager.showAd();

    expect(showAd.called).toEqual(true);
    expect(remove.called).toEqual(true);
  });

  it('is not ready', async () => {
    // const isReady = sandbox.stub(manager, 'isReady').resolves(false as any);
    const showAd = sandbox.stub(AdMobRewarded, 'showAd').resolves();

    await manager.showAd();

    // expect(isReady.called).toEqual(true);
    expect(showAd.called).toEqual(false);
  });

  // TODO
  // it.only('waits for the ad to load', async () => {
  //   const ready = sandbox
  //     .stub(manager, 'isReady')
  //     .onFirstCall()
  //     .resolves(false)
  //     .onSecondCall()
  //     .resolves(true);
  //   const request = sandbox.stub(AdMobRewarded, 'requestAd');

  //   const req = manager.requestAdIfNeeded();
  //   setImmediate(manager.showAd);

  //   console.log('aqui');
  //   expect(ready.callCount).toEqual(1);
  //   request.resolves();
  //   await req;
  //   expect(ready.callCount).toEqual(2);
  // });

  it('resolves when reward is given', async () => {
    sandbox.stub(manager, 'isReady' as any).value(true);
    sandbox.stub(AdMobRewarded, 'showAd');
    const event = sandbox
      .stub(AdMobRewarded, 'addEventListener')
      .returns({ remove: sandbox.stub() });
    let resolved = false;

    const promise = manager.showAd();

    expect(resolved).toEqual(false);
    setImmediate(() => {
      event.callArg(1);
    });

    promise.then(() => {
      resolved = true;
    });

    await promise;

    expect(resolved).toEqual(true);
    expect(event.called).toEqual(true);
  });
});
