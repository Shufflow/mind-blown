import * as RNIap from 'react-native-iap';

import memoize from 'src/utils/memoize';

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
  isAdFree = Promise.resolve(false);

  forceAdFree = false;

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
    this.refreshAdFree();
  }

  refreshAdFree = async () => {
    this.isAdFree = this.checkIsAdFree();
    return this.isAdFree;
  };

  buyAdFree = async () => this.buyProduct(SKU.adFree);

  buyAdFreeDiscount = async () => this.buyProduct(SKU.adFreeDiscount);

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

  private buyProduct = async (sku: SKU) => {
    try {
      await RNIap.buyProduct(sku);
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
