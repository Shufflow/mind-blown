import * as RNIap from 'react-native-iap';
import { Platform } from 'react-native';

import memoize from '@utils/memoize';

export const SKU = {
  adFree: Platform.select({
    android: 'ad_free',
    ios: 'ad_free_full_2',
  }),
  adFreeDiscount: Platform.select({
    android: 'ad_free_2',
    ios: 'ad_free_half_2',
  }),
};

export const IAPErrorCodes = {
  cancelled: 'E_USER_CANCELLED',
  developerError: 'E_DEVELOPER_ERROR',
  unknown: 'E_UNKNOWN',
};

class IAPManager {
  isAvailable: Promise<boolean>;
  isAdFree = Promise.resolve(false);

  forceAdFree = false;

  setup = memoize(async () => {
    const conn = await RNIap.initConnection();
    if (!!conn && conn !== 'false') {
      const skuList = Object.values(SKU);
      const prods = await RNIap.getProducts(skuList);
      this.resolveIsAvailable(prods.length === skuList.length);
    } else {
      this.resolveIsAvailable(false);
    }
  });

  constructor() {
    this.isAvailable = new Promise(resolve => {
      this.resolveIsAvailable = resolve;
    });
    this.setup();
    this.refreshAdFree();
  }

  refreshAdFree = async () => {
    this.isAdFree = this.checkIsAdFree();
    return this.isAdFree;
  };

  buyAdFree = async () => this.buyProduct(SKU.adFree);

  buyAdFreeDiscount = async () => this.buyProduct(SKU.adFreeDiscount);

  private resolveIsAvailable = (v: boolean) => {};

  private checkIsAdFree = async () => {
    await this.setup();
    let purchases: RNIap.Purchase[];
    try {
      purchases = await RNIap.getAvailablePurchases();
    } catch (e) {
      purchases = [];
    }
    return (
      !!purchases.find(purchase =>
        Object.values(SKU).includes(purchase.productId),
      ) || this.forceAdFree
    );
  };

  private buyProduct = async (sku: string) => {
    try {
      const purchase = await RNIap.requestPurchase(sku, false);
      await RNIap.finishTransaction(purchase);
      return true;
    } catch (e) {
      if (e.code !== IAPErrorCodes.unknown) {
        // Usually means payment declined
        throw e;
      }
    }

    return false;
  };
}

export default new IAPManager();
