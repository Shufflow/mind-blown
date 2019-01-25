import * as RNIap from 'react-native-iap';
import { Alert } from 'react-native';

import memoize from 'src/utils/memoize';
import t, { AdDiscountAlert as strings } from 'src/locales';

import { InterstitialAd } from 'src/models/ads';

export enum SKU {
  adFree = 'ad_free',
  adFreeDiscount = 'ad_free_2',
}

export const IAPErrorCodes = {
  cancelled: 'E_USER_CANCELLED',
  developerError: 'E_DEVELOPER_ERROR',
  unknown: 'E_UNKNOWN',
};

class IAPManager {
  isAvailable = false;
  canBuyAdFree = false;
  canBuyAdsDiscount = false;

  setup = memoize(async () => {
    const conn = await RNIap.initConnection();
    const prods = await RNIap.getProducts(Object.values(SKU));

    this.isAvailable = conn === 'true';
    this.canBuyAdFree = !!prods.find(p => p.productId === SKU.adFree);
    this.canBuyAdsDiscount = !!prods.find(
      p => p.productId === SKU.adFreeDiscount,
    );
  });

  constructor() {
    this.setup();
  }

  isAdFree = async () => {
    await this.setup();
    const purchases = await RNIap.getAvailablePurchases();
    return !!purchases.find(purchase =>
      Object.values(SKU).includes(purchase.productId),
    );
  };

  buyProduct = async (sku: SKU) => {
    try {
      await RNIap.buyProduct(sku);
    } catch (e) {
      if (e.code !== IAPErrorCodes.unknown) {
        // Usually means payment declined
        throw e;
      }
    }
  };

  buyAdFree = async () => {
    try {
      await this.buyProduct(SKU.adFree);
    } catch (e) {
      if (e.code === IAPErrorCodes.cancelled && this.canBuyAdsDiscount) {
        Alert.alert(t(strings.title), t(strings.message), [
          {
            style: 'cancel',
            text: t(strings.cancel),
          },
          {
            onPress: this.showRewardedAd,
            text: t(strings.confirm),
          },
        ]);
      }
    }
  };

  buyAdFreeDiscount = async () => {
    await this.buyProduct(SKU.adFreeDiscount);
  };

  showRewardedAd = async () => {
    await InterstitialAd.showRewardedAd();
    await this.buyAdFreeDiscount();
  };
}

export default new IAPManager();
