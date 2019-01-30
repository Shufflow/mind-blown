import { createSandbox } from 'sinon';
import { Alert, Linking } from 'react-native';
import * as RNIap from 'react-native-iap';
import { AdMobRewarded } from 'react-native-admob';

import IAP, { IAPErrorCodes } from 'src/models/iap';
import RewardedAd from 'src/models/rewardedAd';

import SettingsViewModel from '../settings';

const sandbox = createSandbox();
const viewModel = new SettingsViewModel(
  { showAds: false } as any,
  () => ({ canBuyDiscount: false }),
  () => {},
);
afterEach(sandbox.restore);

describe('handle navigate', () => {
  it('calls navigate with the given routeName', () => {
    const navigate = sandbox.stub();
    sandbox.stub(viewModel, 'props').value({
      navigation: { navigate, color: {} },
    });

    viewModel.handleNavigate('foobar')();

    expect(navigate.calledWithMatch('foobar')).toEqual(true);
  });
});

describe('handle buy ad free', () => {
  describe('discount', () => {
    beforeEach(() => {
      sandbox.stub(viewModel, 'getState').returns({ canBuyDiscount: true });
    });

    it('purchase', async () => {
      const discount = sandbox.stub(IAP, 'buyAdFreeDiscount');
      const fullPrice = sandbox.stub(IAP, 'buyAdFree');

      await viewModel.handleBuyAdFree();

      expect(discount.called).toEqual(true);
      expect(fullPrice.called).toEqual(false);
    });

    it('notifies ad provider when purchase is successful', async () => {
      const checkShowAds = sandbox.stub();
      sandbox.stub(IAP, 'buyAdFreeDiscount').resolves(true);
      sandbox.stub(viewModel, 'props').value({ checkShowAds });

      await viewModel.handleBuyAdFree();

      expect(checkShowAds.called).toEqual(true);
    });

    it('does not notify ad provider when purchase is not successful', async () => {
      const checkShowAds = sandbox.stub();
      sandbox.stub(IAP, 'buyAdFreeDiscount').resolves(false);
      sandbox.stub(viewModel, 'props').value({ checkShowAds });

      await viewModel.handleBuyAdFree();

      expect(checkShowAds.called).toEqual(false);
    });
  });

  describe('full price', () => {
    beforeEach(() => {
      sandbox.stub(viewModel, 'getState').returns({ canBuyDiscount: false });
    });

    it('purchase', async () => {
      const discount = sandbox.stub(IAP, 'buyAdFreeDiscount');
      const fullPrice = sandbox.stub(IAP, 'buyAdFree');

      await viewModel.handleBuyAdFree();

      expect(discount.called).toEqual(false);
      expect(fullPrice.called).toEqual(true);
    });

    it('notifies ad provider when purchase is successful', async () => {
      const checkShowAds = sandbox.stub();
      sandbox.stub(IAP, 'buyAdFree').resolves(true);
      sandbox.stub(viewModel, 'props').value({ checkShowAds });

      await viewModel.handleBuyAdFree();

      expect(checkShowAds.called).toEqual(true);
    });

    it('does not notify ad provider when purchase is not successful', async () => {
      const checkShowAds = sandbox.stub();
      sandbox.stub(IAP, 'buyAdFree').resolves(false);
      sandbox.stub(viewModel, 'props').value({ checkShowAds });

      await viewModel.handleBuyAdFree();

      expect(checkShowAds.called).toEqual(false);
    });
  });
});

describe('handle open URL', () => {
  it('opens the given url', async () => {
    const link = sandbox.stub(Linking, 'openURL').resolves();

    await viewModel.handleOpenURL('foobar')();

    expect(link.calledWith('foobar')).toEqual(true);
  });
});

describe('buy ad free', () => {
  it('buys ad free', async () => {
    const buy = sandbox.stub(IAP, 'buyAdFree').resolves(true);

    const result = await viewModel.buyAdFree();

    expect(result).toEqual(true);
    expect(buy.called).toEqual(true);
  });

  it('shows discount alert on cancel if can buy discount', async () => {
    sandbox.stub(IAP, 'buyAdFree').rejects({ code: IAPErrorCodes.cancelled });
    sandbox.stub(IAP, 'canBuyAdsDiscount').value(true);
    sandbox.stub(RewardedAd, 'requestAdIfNeeded').resolves();
    const alert = sandbox.stub(Alert, 'alert');

    const result = await viewModel.buyAdFree();

    expect(result).toEqual(false);
    expect(alert.called).toEqual(true);
  });

  it('does not show alert if cannot buy discount', async () => {
    sandbox.stub(IAP, 'buyAdFree').rejects({ code: IAPErrorCodes.cancelled });
    sandbox.stub(IAP, 'canBuyAdsDiscount').value(false);
    const alert = sandbox.stub(Alert, 'alert');

    const result = await viewModel.buyAdFree();

    expect(result).toEqual(false);
    expect(alert.called).toEqual(false);
  });

  it('does not show alert if ad fails to load', async () => {
    const error = new Error('fail');
    sandbox.stub(IAP, 'buyAdFree').rejects({ code: IAPErrorCodes.cancelled });
    sandbox.stub(IAP, 'canBuyAdsDiscount').value(true);
    sandbox.stub(RewardedAd, 'requestAdIfNeeded').rejects(error);
    const alert = sandbox.stub(Alert, 'alert');

    try {
      await viewModel.buyAdFree();
    } catch (e) {
      fail('should not have thrown error');
    }

    expect(alert.called).toEqual(false);
  });
});

describe('show rewarded ad', () => {
  it('shows the ad', async () => {
    const ad = sandbox.stub(RewardedAd, 'showAd');
    sandbox.stub(RNIap, 'buyProduct');

    await viewModel.showRewardedAd();

    expect(ad.called).toEqual(true);
  });

  it('calls buy discounted when reward is given', async () => {
    sandbox.stub(RewardedAd, 'showAd');
    const discount = sandbox.stub(IAP, 'buyAdFreeDiscount');

    await viewModel.showRewardedAd();

    expect(discount.called).toEqual(true);
  });

  it('does not buy discounted ad when reward is not given', async () => {
    sandbox.stub(AdMobRewarded, 'addEventListener');
    const discount = sandbox.stub(IAP, 'buyAdFreeDiscount');
    let resolved = false;

    viewModel.showRewardedAd().then(() => {
      resolved = true;
    });

    expect(discount.called).toEqual(false);
    expect(resolved).toEqual(false);
  });

  it('updates view when discount is available', async () => {
    sandbox.stub(RewardedAd, 'showAd').resolves();
    const setState = sandbox.stub(viewModel, 'setState');

    await viewModel.showRewardedAd();

    expect(setState.calledWith({ canBuyDiscount: true })).toEqual(true);
  });
});

describe('handle set locale', () => {
  it("sets the context's provider locale", () => {
    const setLocale = sandbox.stub();
    sandbox.stub(viewModel, 'props').value({
      setLocale,
      navigation: {
        setParams: sandbox.stub(),
      },
    });

    viewModel.handleSetLocale('foobar');

    expect(setLocale.calledWith('foobar')).toEqual(true);
  });

  it('updates navigation params', () => {
    const setParams = sandbox.stub();
    sandbox.stub(viewModel, 'props').value({
      navigation: {
        setParams,
      },
      setLocale: sandbox.stub(),
    });

    viewModel.handleSetLocale('foobar');

    expect(setParams.called).toEqual(true);
  });
});
