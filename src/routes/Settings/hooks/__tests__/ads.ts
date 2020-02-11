import { createSandbox, assert } from 'sinon';
import { Alert } from 'react-native';
import { renderHook, act } from '@testing-library/react-hooks';

import * as useAds from '@hocs/withAds';

import IAP, { IAPErrorCodes } from 'src/models/iap';

import * as hooks from '../ads';
const { buyAdFree } = hooks;

const sandbox = createSandbox();
afterEach(sandbox.restore);

describe('buy ad free', () => {
  let setCanBuyDiscount: sinon.SinonStub;
  let processPurchase: sinon.SinonStub;
  let requestAd: sinon.SinonStub;
  let buy: sinon.SinonStub;
  let showAd: sinon.SinonStub;
  let originalRef: any;
  let ref: any;

  beforeEach(() => {
    sandbox.stub(console, 'warn');
    setCanBuyDiscount = sandbox.stub();
    processPurchase = sandbox.stub();
    requestAd = sandbox.stub();
    showAd = sandbox.stub();
    buy = sandbox.stub(IAP, 'buyAdFree').resolves(true);

    originalRef = { requestAdIfNeeded: requestAd, showAd };
    ref = { current: originalRef };
  });

  it('buys full-price ad-free IAP', async () => {
    requestAd.returns(
      new Promise<void>(() => {}),
    );

    const result = await buyAdFree(ref, setCanBuyDiscount, processPurchase);

    assert.callOrder(requestAd, buy);
    expect(result).toBe(true);
    expect(ref.current).toBe(originalRef);
  });

  it('supresses ad loading errors', async () => {
    requestAd.rejects('error');

    const result = buyAdFree(ref, setCanBuyDiscount, processPurchase);

    expect(result).rejects.toBeUndefined();
  });

  it('does nothing if buy fails with unknown error', async () => {
    buy.rejects({ code: IAPErrorCodes.unknown });

    const result = await buyAdFree(ref, setCanBuyDiscount, processPurchase);

    expect(result).toBe(false);
  });

  describe('half-price IAP', () => {
    let alert: sinon.SinonStub;

    beforeEach(() => {
      alert = sandbox.stub(Alert, 'alert');
      buy.rejects({ code: IAPErrorCodes.cancelled });
      requestAd.resolves();
    });

    it('does nothing if rewarded ad fails', async () => {
      requestAd.rejects('error');

      const result = await buyAdFree(ref, setCanBuyDiscount, processPurchase);

      assert.notCalled(alert);
      expect(result).toBe(false);
    });

    it('offers half-price IAP if the user cancels', async () => {
      await buyAdFree(ref, setCanBuyDiscount, processPurchase);

      assert.called(alert);
    });

    describe('user confirmation', () => {
      let buyDiscount: sinon.SinonStub;

      beforeEach(() => {
        buyDiscount = sandbox.stub(IAP, 'buyAdFreeDiscount');
        showAd.resolves();
      });

      const confirmAlert = () => {
        const [, { onPress }] = alert.args[0][2];
        return onPress();
      };

      it('shows the rewarded ad', async () => {
        await buyAdFree(ref, setCanBuyDiscount, processPurchase);
        confirmAlert();

        assert.called(showAd);
      });

      it('loads next rewarded ad after showing', async () => {
        await buyAdFree(ref, setCanBuyDiscount, processPurchase);
        await confirmAlert();

        expect(ref.current).not.toBe(originalRef);
      });

      it('does nothing if reward fails', async () => {
        await buyAdFree(ref, setCanBuyDiscount, processPurchase);
        confirmAlert();

        assert.notCalled(setCanBuyDiscount);
        assert.notCalled(buyDiscount);
        assert.notCalled(processPurchase);
      });

      describe('buy discount', () => {
        it('buys with discount', async () => {
          await buyAdFree(ref, setCanBuyDiscount, processPurchase);
          await confirmAlert();

          assert.calledWithExactly(setCanBuyDiscount, true);
          assert.called(buyDiscount);
        });

        it('processes a purchase', async () => {
          buyDiscount.resolves(true);

          await buyAdFree(ref, setCanBuyDiscount, processPurchase);
          await confirmAlert();

          assert.called(processPurchase);
        });

        it('does not process if buying fails', async () => {
          buyDiscount.resolves(false);

          await buyAdFree(ref, setCanBuyDiscount, processPurchase);
          await confirmAlert();

          assert.called(buyDiscount);
          assert.notCalled(processPurchase);
        });

        it('suppresses buying errors', async () => {
          buyDiscount.rejects('error');

          await buyAdFree(ref, setCanBuyDiscount, processPurchase);
          await confirmAlert().catch(() => {});

          assert.called(buyDiscount);
          assert.notCalled(processPurchase);
        });
      });
    });
  });
});

describe('use ads settings', () => {
  let checkIsAdFree: sinon.SinonStub;
  let buy: sinon.SinonStub;
  let buyDiscount: sinon.SinonStub;

  beforeEach(() => {
    checkIsAdFree = sandbox.stub().resolves(true);

    sandbox.stub(useAds, 'useAds').returns({ checkIsAdFree } as any);
    buy = sandbox.stub(hooks, 'buyAdFree').resolves(true);
    buyDiscount = sandbox.stub(IAP, 'buyAdFreeDiscount');
  });

  describe('init', () => {
    let iap: sinon.SinonStub;

    beforeEach(() => {
      iap = sandbox.stub(IAP, 'isAvailable');
    });

    /**
     * TODO
     * Interstitial ads have been temporarily removed while IAP is not working
     */
    it.skip('sets iap availability', async () => {
      const isIAPAvailable = true;
      iap.value(Promise.resolve(isIAPAvailable));

      const { result, waitForNextUpdate } = renderHook(hooks.useAdsSettings);

      await waitForNextUpdate();

      expect(result.current.isIAPAvailable).toBe(true);
    });
  });

  describe('handle buy ad free', () => {
    describe('buy at full-price', () => {
      it('buys and processes the purchase', async () => {
        const { result } = renderHook(hooks.useAdsSettings);

        await act(result.current.handleBuyAdFree);

        assert.called(buy);
        assert.called(checkIsAdFree);
        assert.notCalled(buyDiscount);
        expect(result.current.isAdFree).toBe(true);
      });

      it('does not processes the purchase if buying fails', async () => {
        buy.resolves(false);
        const { result } = renderHook(hooks.useAdsSettings);

        await act(result.current.handleBuyAdFree);

        assert.called(buy);
        assert.notCalled(checkIsAdFree);
        assert.notCalled(buyDiscount);
        expect(result.current.isAdFree).toBe(false);
      });
    });

    describe('can buy with discount', () => {
      const setup = (fn: Function) => async () => {
        buy.resolves(false);
        await fn();
        const [[, setter]] = buy.args;
        setter(true);

        sandbox.resetHistory();
      };

      it('buys and processes the purchase', async () => {
        buyDiscount.resolves(true);
        const { result } = renderHook(hooks.useAdsSettings);

        await act(setup(result.current.handleBuyAdFree));
        await act(result.current.handleBuyAdFree);

        assert.notCalled(buy);
        assert.called(buyDiscount);
        assert.called(checkIsAdFree);
        expect(result.current.isAdFree).toBe(true);
      });

      it('does not processes the purchase if buying fails', async () => {
        buyDiscount.resolves(false);
        const { result } = renderHook(hooks.useAdsSettings);

        await act(setup(result.current.handleBuyAdFree));
        await act(result.current.handleBuyAdFree);

        assert.called(buyDiscount);
        assert.notCalled(buy);
        assert.notCalled(checkIsAdFree);
        expect(result.current.isAdFree).toBe(false);
      });
    });
  });
});
