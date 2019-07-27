import { createSandbox } from 'sinon';
import * as RNIap from 'react-native-iap';

import { wipeMemoizeCache } from '@utils/memoize';

import IAP, { SKU, IAPErrorCodes } from '../iap';

jest.unmock('react-native-iap');

const sandbox = createSandbox();
beforeEach(wipeMemoizeCache);
afterEach(sandbox.restore);

describe('setup', () => {
  beforeEach(() => {
    IAP.isAvailable = new Promise(resolve => {
      (IAP as any).resolveIsAvailable = resolve;
    });
  });

  it('has IAP available', async () => {
    const init = sandbox.stub(RNIap, 'initConnection').resolves('true');
    sandbox.stub(RNIap, 'getProducts').resolves(Object.values(SKU) as any);

    await IAP.setup();
    const result = await IAP.isAvailable;

    expect(init.called).toEqual(true);
    expect(result).toEqual(true);
  });

  it('has IAP unavailable', async () => {
    const init = sandbox.stub(RNIap, 'initConnection').resolves('false');
    sandbox.stub(RNIap, 'getProducts').resolves([]);

    await IAP.setup();
    const result = await IAP.isAvailable;

    expect(init.called).toEqual(true);
    expect(result).toEqual(false);
  });
});

describe('refresh ad free', () => {
  beforeEach(() => {
    sandbox.stub(RNIap, 'initConnection').resolves('true');
    sandbox.stub(RNIap, 'getProducts').resolves([]);
  });

  it('has purchased AdFree', async () => {
    sandbox
      .stub(RNIap, 'getAvailablePurchases')
      .resolves([{ productId: SKU.adFree }] as any);

    const result = await IAP.refreshAdFree();

    expect(result).toEqual(true);
  });

  it('has purchased AdFreeDiscount', async () => {
    sandbox
      .stub(RNIap, 'getAvailablePurchases')
      .resolves([{ productId: SKU.adFreeDiscount }] as any);

    const result = await IAP.refreshAdFree();

    expect(result).toEqual(true);
  });

  it('has not purchased anything', async () => {
    sandbox.stub(RNIap, 'getAvailablePurchases').resolves([]);

    const result = await IAP.refreshAdFree();

    expect(result).toEqual(false);
  });

  it('forces ad free', async () => {
    sandbox.stub(RNIap, 'getAvailablePurchases').resolves([]);
    sandbox.stub(IAP, 'forceAdFree').value(true);

    const result = await IAP.refreshAdFree();

    expect(result).toEqual(true);
  });
});

describe('buy ad free', () => {
  let finishTrans: sinon.SinonStub;
  let buy: sinon.SinonStub;

  beforeEach(() => {
    finishTrans = sandbox.stub(RNIap, 'finishTransaction');
    buy = sandbox.stub(RNIap, 'buyProduct').resolves();
  });

  it('completes a purchase', async () => {
    const result = await IAP.buyAdFree();

    expect(result).toEqual(true);
    expect(buy.calledWith(SKU.adFree)).toEqual(true);
    expect(finishTrans.called).toEqual(true);
  });

  it('does not throw payment declined', async () => {
    buy.rejects({ code: IAPErrorCodes.unknown });

    const result = await IAP.buyAdFree();

    expect(result).toEqual(false);
    expect(buy.calledWith(SKU.adFree)).toEqual(true);
    expect(finishTrans.called).toEqual(false);
  });

  it('rethrows exception', async () => {
    const error = { code: IAPErrorCodes.developerError };
    buy.rejects(error);

    try {
      await IAP.buyAdFree();
      fail('should have thrown error');
    } catch (e) {
      expect(e).toEqual(error);
    }

    expect(buy.calledWith(SKU.adFree)).toEqual(true);
    expect(finishTrans.called).toEqual(false);
  });
});

describe('buy ad free discount', () => {
  let finishTrans: sinon.SinonStub;
  let buy: sinon.SinonStub;

  beforeEach(() => {
    finishTrans = sandbox.stub(RNIap, 'finishTransaction');
    buy = sandbox.stub(RNIap, 'buyProduct').resolves();
  });

  it('completes a purchase', async () => {
    buy.resolves();

    const result = await IAP.buyAdFreeDiscount();

    expect(result).toEqual(true);
    expect(buy.calledWith(SKU.adFreeDiscount)).toEqual(true);
    expect(finishTrans.called).toEqual(true);
  });

  it('does not throw payment declined', async () => {
    buy.rejects({ code: IAPErrorCodes.unknown });

    const result = await IAP.buyAdFreeDiscount();

    expect(result).toEqual(false);
    expect(buy.calledWith(SKU.adFreeDiscount)).toEqual(true);
    expect(finishTrans.called).toEqual(false);
  });

  it('rethrows exception', async () => {
    const error = { code: IAPErrorCodes.developerError };
    buy.rejects(error);

    try {
      await IAP.buyAdFreeDiscount();
      fail('should have thrown error');
    } catch (e) {
      expect(e).toEqual(error);
    }

    expect(buy.calledWith(SKU.adFreeDiscount)).toEqual(true);
    expect(finishTrans.called).toEqual(false);
  });
});
