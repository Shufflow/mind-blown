import { createSandbox, assert } from 'sinon';
import { Alert } from 'react-native';
import * as RNIap from 'react-native-iap';

import IAP, { IAPErrorCodes } from 'src/models/iap';

import SettingsViewModel, { State } from '../settings';

const sandbox = createSandbox();
const state: State = {
  canBuyDiscount: false,
  isAdFree: false,
  isIAPAvailable: false,
};
const viewModel = new SettingsViewModel(
  () => ({ showAds: false } as any),
  () => state,
  () => {},
);
afterEach(sandbox.restore);

describe('initial state', () => {
  it('is not ad free', () => {
    const result = viewModel.getInitialState({ showAds: true } as any);

    expect(result).toEqual({
      ...state,
      isAdFree: false,
    });
  });

  it('is ad free', () => {
    const result = viewModel.getInitialState({ showAds: false } as any);

    expect(result).toEqual({
      ...state,
      isAdFree: true,
    });
  });
});

describe('init', () => {
  let iap: sinon.SinonStub;
  let setState: sinon.SinonStub;

  beforeEach(() => {
    iap = sandbox.stub(IAP, 'isAvailable');
    setState = sandbox.stub(viewModel, 'setState');
  });

  it('sets iap availability', async () => {
    const isIAPAvailable = true;
    iap.value(Promise.resolve(isIAPAvailable));

    await viewModel.init();

    assert.calledWith(setState, { isIAPAvailable });
  });
});

describe('handle navigate', () => {
  it('calls navigate with the given routeName', () => {
    const navigate = sandbox.stub();
    sandbox.stub(viewModel, 'getProps').returns({
      navigation: { navigate, color: {} },
    } as any);

    viewModel.handleNavigate('foobar')();

    expect(navigate.calledWithMatch('foobar')).toEqual(true);
  });
});

describe('handle buy ad free', () => {
  describe('discount', () => {
    beforeEach(() => {
      sandbox
        .stub(viewModel, 'getState')
        .returns({ ...state, canBuyDiscount: true });
    });

    it('purchase', async () => {
      const discount = sandbox.stub(IAP, 'buyAdFreeDiscount');
      const fullPrice = sandbox.stub(IAP, 'buyAdFree');

      await viewModel.handleBuyAdFree();

      expect(discount.called).toEqual(true);
      expect(fullPrice.called).toEqual(false);
    });

    it('notifies ad provider when purchase is successful', async () => {
      const checkIsAdFree = sandbox.stub();
      sandbox.stub(IAP, 'buyAdFreeDiscount').resolves(true);
      sandbox.stub(viewModel, 'getProps').returns({ checkIsAdFree } as any);

      await viewModel.handleBuyAdFree();

      expect(checkIsAdFree.called).toEqual(true);
    });

    it('does not notify ad provider when purchase is not successful', async () => {
      const checkIsAdFree = sandbox.stub();
      sandbox.stub(IAP, 'buyAdFreeDiscount').resolves(false);
      sandbox.stub(viewModel, 'getProps').returns({ checkIsAdFree } as any);

      await viewModel.handleBuyAdFree();

      expect(checkIsAdFree.called).toEqual(false);
    });

    it('updates the state when becomes ad free', async () => {
      const checkIsAdFree = sandbox.stub().resolves(true);
      const setState = sandbox.stub();
      sandbox.stub(IAP, 'buyAdFreeDiscount').resolves(true);
      sandbox.stub(viewModel, 'getProps').returns({ checkIsAdFree } as any);
      sandbox.stub(viewModel, 'setState').value(setState);

      await viewModel.handleBuyAdFree();

      expect(checkIsAdFree.called).toEqual(true);
      expect(setState.calledWith({ isAdFree: true }));
    });
  });

  describe('full price', () => {
    beforeEach(() => {
      sandbox
        .stub(viewModel, 'getState')
        .returns({ ...state, canBuyDiscount: false });
    });

    it('purchase', async () => {
      const discount = sandbox.stub(IAP, 'buyAdFreeDiscount');
      const fullPrice = sandbox.stub(IAP, 'buyAdFree');

      await viewModel.handleBuyAdFree();

      expect(discount.called).toEqual(false);
      expect(fullPrice.called).toEqual(true);
    });

    it('notifies ad provider when purchase is successful', async () => {
      const checkIsAdFree = sandbox.stub();
      sandbox.stub(IAP, 'buyAdFree').resolves(true);
      sandbox.stub(viewModel, 'getProps').returns({ checkIsAdFree } as any);

      await viewModel.handleBuyAdFree();

      expect(checkIsAdFree.called).toEqual(true);
    });

    it('does not notify ad provider when purchase is not successful', async () => {
      const checkIsAdFree = sandbox.stub();
      sandbox.stub(IAP, 'buyAdFree').resolves(false);
      sandbox.stub(viewModel, 'getProps').returns({ checkIsAdFree } as any);

      await viewModel.handleBuyAdFree();

      expect(checkIsAdFree.called).toEqual(false);
    });
  });
});

describe('buy ad free', () => {
  it('buys ad free', async () => {
    const buy = sandbox.stub(IAP, 'buyAdFree').resolves(true);

    const result = await (viewModel as any).buyAdFree();

    expect(result).toEqual(true);
    expect(buy.called).toEqual(true);
  });

  it('shows discount alert on cancel if can buy discount', async () => {
    sandbox.stub(IAP, 'buyAdFree').rejects({ code: IAPErrorCodes.cancelled });
    sandbox.stub(viewModel.rewardedAd, 'requestAdIfNeeded').resolves();
    const alert = sandbox.stub(Alert, 'alert');

    const result = await (viewModel as any).buyAdFree();

    expect(result).toEqual(false);
    expect(alert.called).toEqual(true);
  });

  it('does not show alert if ad fails to load', async () => {
    const error = new Error('fail');
    sandbox.stub(IAP, 'buyAdFree').rejects({ code: IAPErrorCodes.cancelled });
    sandbox.stub(viewModel.rewardedAd, 'requestAdIfNeeded').rejects(error);
    const alert = sandbox.stub(Alert, 'alert');

    try {
      await (viewModel as any).buyAdFree();
    } catch (e) {
      fail('should not have thrown error');
    }

    expect(alert.called).toEqual(false);
  });
});

describe('show rewarded ad', () => {
  beforeEach(() => {
    const checkIsAdFree = sandbox.stub();
    sandbox.stub(viewModel, 'getProps').returns({ checkIsAdFree } as any);
  });
  it('shows the ad', async () => {
    const ad = sandbox.stub(viewModel.rewardedAd, 'showAd');
    sandbox.stub(RNIap, 'requestPurchase');

    await (viewModel as any).showRewardedAd();

    expect(ad.called).toEqual(true);
  });

  it('calls buy discounted when reward is given', async () => {
    sandbox.stub(viewModel.rewardedAd, 'showAd');
    const discount = sandbox.stub(IAP, 'buyAdFreeDiscount');

    await (viewModel as any).showRewardedAd();

    expect(discount.called).toEqual(true);
  });

  it('does not buy discounted ad when reward is not given', async () => {
    const discount = sandbox.stub(IAP, 'buyAdFreeDiscount');
    let resolved = false;

    (viewModel as any).showRewardedAd().then(() => {
      resolved = true;
    });

    expect(discount.called).toEqual(false);
    expect(resolved).toEqual(false);
  });

  it('updates view when discount is available', async () => {
    sandbox.stub(viewModel.rewardedAd, 'showAd').resolves();
    const setState = sandbox.stub();
    sandbox.stub(viewModel, 'setState').value(setState);

    await (viewModel as any).showRewardedAd();

    expect(setState.calledWith({ canBuyDiscount: true })).toEqual(true);
  });
});

describe('handle set locale', () => {
  it("sets the context's provider locale", () => {
    const setLocale = sandbox.stub();
    sandbox.stub(viewModel, 'getProps').returns({
      setLocale,
      navigation: {
        setParams: sandbox.stub(),
      },
    } as any);

    viewModel.handleSetLocale('foobar');

    expect(setLocale.calledWith('foobar')).toEqual(true);
  });

  it('updates navigation params', () => {
    const setParams = sandbox.stub();
    sandbox.stub(viewModel, 'getProps').returns({
      navigation: {
        setParams,
      },
      setLocale: sandbox.stub(),
    } as any);

    viewModel.handleSetLocale('foobar');

    expect(setParams.called).toEqual(true);
  });
});
