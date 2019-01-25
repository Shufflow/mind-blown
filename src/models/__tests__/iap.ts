import { createSandbox } from 'sinon';
import * as RNIap from 'react-native-iap';
import { Alert } from 'react-native';
import { AdMobRewarded } from 'react-native-admob';

import { wipeMemoizeCache } from 'src/utils/memoize';

import IAP, { SKU, IAPErrorCodes } from '../iap';
import { InterstitialAd } from '../ads';

jest.unmock('react-native-iap');

const sandbox = createSandbox();
beforeEach(wipeMemoizeCache);
afterEach(sandbox.restore);

describe('setup', () => {
  it('has IAP available', async () => {
    const init = sandbox.stub(RNIap, 'initConnection').resolves('true');
    sandbox.stub(RNIap, 'getProducts').resolves([]);

    await IAP.setup();

    expect(init.called).toEqual(true);
    expect(IAP.isAvailable).toEqual(true);
  });

  it('has IAP unavailable', async () => {
    const init = sandbox.stub(RNIap, 'initConnection').resolves('false');
    sandbox.stub(RNIap, 'getProducts').resolves([]);

    await IAP.setup();

    expect(init.called).toEqual(true);
    expect(IAP.isAvailable).toEqual(false);
  });
});

describe('can buy ad free', () => {
  it('has SKU available', async () => {
    sandbox.stub(RNIap, 'initConnection').resolves('true');
    const prods = sandbox
      .stub(RNIap, 'getProducts')
      .resolves([{ productId: SKU.adFree }] as any);

    await IAP.setup();

    expect(prods.called).toEqual(true);
    expect(IAP.canBuyAdFree).toEqual(true);
  });

  it('has SKU unavailable', async () => {
    sandbox.stub(RNIap, 'initConnection').resolves('true');
    const prods = sandbox.stub(RNIap, 'getProducts').resolves([]);

    await IAP.setup();

    expect(prods.called).toEqual(true);
    expect(IAP.canBuyAdFree).toEqual(false);
  });
});

describe('can buy ad free discount', () => {
  it('has SKU available', async () => {
    sandbox.stub(RNIap, 'initConnection').resolves('true');
    const prods = sandbox
      .stub(RNIap, 'getProducts')
      .resolves([{ productId: SKU.adFreeDiscount }] as any);

    await IAP.setup();

    expect(prods.called).toEqual(true);
    expect(IAP.canBuyAdsDiscount).toEqual(true);
  });

  it('has SKU unavailable', async () => {
    sandbox.stub(RNIap, 'initConnection').resolves('true');
    const prods = sandbox.stub(RNIap, 'getProducts').resolves([]);

    await IAP.setup();

    expect(prods.called).toEqual(true);
    expect(IAP.canBuyAdsDiscount).toEqual(false);
  });
});

describe('is ad free', () => {
  beforeEach(() => {
    sandbox.stub(RNIap, 'initConnection').resolves('true');
    sandbox.stub(RNIap, 'getProducts').resolves([]);
  });

  it('has purchased AdFree', async () => {
    sandbox
      .stub(RNIap, 'getAvailablePurchases')
      .resolves([{ productId: SKU.adFree }] as any);

    const result = await IAP.isAdFree();

    expect(result).toEqual(true);
  });

  it('has purchased AdFreeDiscount', async () => {
    sandbox
      .stub(RNIap, 'getAvailablePurchases')
      .resolves([{ productId: SKU.adFreeDiscount }] as any);

    const result = await IAP.isAdFree();

    expect(result).toEqual(true);
  });

  it('has not purchased anything', async () => {
    sandbox.stub(RNIap, 'getAvailablePurchases').resolves([]);

    const result = await IAP.isAdFree();

    expect(result).toEqual(false);
  });
});

describe('buy ad free', () => {
  it('completes a purchase', async () => {
    const buy = sandbox.stub(RNIap, 'buyProduct').resolves();

    await IAP.buyAdFree();

    expect(buy.calledWith(SKU.adFree)).toEqual(true);
  });

  it('does not throw payment declined', async () => {
    const buy = sandbox
      .stub(RNIap, 'buyProduct')
      .rejects({ code: IAPErrorCodes.cancelled });

    expect(async () => {
      await IAP.buyAdFree();
    }).not.toThrow();

    expect(buy.calledWith(SKU.adFree)).toEqual(true);
  });

  it('shows discount alert on cancel if can buy discount', async () => {
    sandbox
      .stub(RNIap, 'buyProduct')
      .rejects({ code: IAPErrorCodes.cancelled });
    sandbox.stub(IAP, 'canBuyAdsDiscount').value(true);
    const alert = sandbox.stub(Alert, 'alert');

    await IAP.buyAdFree();

    expect(alert.called).toEqual(true);
  });

  it('does not show alert if cannot buy discount', async () => {
    sandbox
      .stub(RNIap, 'buyProduct')
      .rejects({ code: IAPErrorCodes.cancelled });
    sandbox.stub(IAP, 'canBuyAdsDiscount').value(false);
    const alert = sandbox.stub(Alert, 'alert');

    await IAP.buyAdFree();

    expect(alert.called).toEqual(false);
  });
});

describe('buy ad free discount', () => {
  it('completes a purchase', async () => {
    const buy = sandbox.stub(RNIap, 'buyProduct').resolves();

    await IAP.buyAdFreeDiscount();

    expect(buy.calledWith(SKU.adFreeDiscount)).toEqual(true);
  });

  it('does not throw payment declined', async () => {
    const buy = sandbox
      .stub(RNIap, 'buyProduct')
      .rejects({ code: IAPErrorCodes.cancelled });

    expect(async () => {
      await IAP.buyAdFreeDiscount();
    }).not.toThrow();

    expect(buy.calledWith(SKU.adFreeDiscount)).toEqual(true);
  });

  it('rethrows exception', async () => {
    const error = { code: IAPErrorCodes.developerError };
    const buy = sandbox.stub(RNIap, 'buyProduct').rejects(error);

    try {
      await IAP.buyAdFreeDiscount();
      fail('should have thrown error');
    } catch (e) {
      expect(e).toEqual(error);
    }

    expect(buy.calledWith(SKU.adFreeDiscount)).toEqual(true);
  });
});

describe('show rewarded ad', () => {
  it('shows the ad', async () => {
    const ad = sandbox.stub(InterstitialAd, 'showRewardedAd');
    sandbox.stub(RNIap, 'buyProduct');

    await IAP.showRewardedAd();

    expect(ad.called).toEqual(true);
  });

  it('calls buy discounted when reward is given', async () => {
    const reward = sandbox.stub(AdMobRewarded, 'addEventListener');
    const discount = sandbox.stub(IAP, 'buyAdFreeDiscount');

    const result = IAP.showRewardedAd();
    reward.callArg(1);

    await result;

    expect(discount.called).toEqual(true);
  });

  it('does not buy discounted ad when reward is not given', async () => {
    sandbox.stub(AdMobRewarded, 'addEventListener');
    const discount = sandbox.stub(IAP, 'buyAdFreeDiscount');
    let resolved = false;

    IAP.showRewardedAd().then(() => {
      resolved = true;
    });

    expect(discount.called).toEqual(false);
    expect(resolved).toEqual(false);
  });
});
