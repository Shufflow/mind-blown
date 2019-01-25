import { createSandbox } from 'sinon';
import { Alert, Linking } from 'react-native';
import * as RNIap from 'react-native-iap';
import { AdMobRewarded } from 'react-native-admob';

import IAP, { IAPErrorCodes } from 'src/models/iap';
import { InterstitialAd } from 'src/models/ads';

import SettingsViewModel from '../settings';

const sandbox = createSandbox();
const viewModel = new SettingsViewModel({ showAds: false } as any, () => {});
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
  it('buys with discount if can', async () => {
    sandbox.stub(viewModel, 'canBuyDiscount').value(true);
    const discount = sandbox.stub(IAP, 'buyAdFreeDiscount');
    const fullPrice = sandbox.stub(IAP, 'buyAdFree');

    await viewModel.handleBuyAdFree();

    expect(discount.called).toEqual(true);
    expect(fullPrice.called).toEqual(false);
  });

  it('buys full price if discount not available', async () => {
    sandbox.stub(viewModel, 'canBuyDiscount').value(false);
    const discount = sandbox.stub(IAP, 'buyAdFreeDiscount');
    const fullPrice = sandbox.stub(IAP, 'buyAdFree');

    await viewModel.handleBuyAdFree();

    expect(discount.called).toEqual(false);
    expect(fullPrice.called).toEqual(true);
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
    const buy = sandbox.stub(IAP, 'buyAdFree').resolves();

    expect(async () => {
      viewModel.buyAdFree();
    }).not.toThrow();

    expect(buy.called).toEqual(true);
  });

  it('shows discount alert on cancel if can buy discount', async () => {
    sandbox.stub(IAP, 'buyAdFree').rejects({ code: IAPErrorCodes.cancelled });
    sandbox.stub(IAP, 'canBuyAdsDiscount').value(true);
    const alert = sandbox.stub(Alert, 'alert');

    await viewModel.buyAdFree();

    expect(alert.called).toEqual(true);
  });

  it('does not show alert if cannot buy discount', async () => {
    sandbox.stub(IAP, 'buyAdFree').rejects({ code: IAPErrorCodes.cancelled });
    sandbox.stub(IAP, 'canBuyAdsDiscount').value(false);
    const alert = sandbox.stub(Alert, 'alert');

    await viewModel.buyAdFree();

    expect(alert.called).toEqual(false);
  });
});

describe('show rewarded ad', () => {
  it('shows the ad', async () => {
    const ad = sandbox.stub(InterstitialAd, 'showRewardedAd');
    sandbox.stub(RNIap, 'buyProduct');

    await viewModel.showRewardedAd();

    expect(ad.called).toEqual(true);
  });

  it('calls buy discounted when reward is given', async () => {
    const reward = sandbox.stub(AdMobRewarded, 'addEventListener');
    const discount = sandbox.stub(IAP, 'buyAdFreeDiscount');

    const result = viewModel.showRewardedAd();
    reward.callArg(1);

    await result;

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
    sandbox.stub(InterstitialAd, 'showRewardedAd').resolves();
    const update = sandbox.stub(viewModel, 'enableBuyDiscount');

    await viewModel.showRewardedAd();

    expect(update.called).toEqual(true);
  });
});
