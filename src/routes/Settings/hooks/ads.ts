import { useState, useCallback, MutableRefObject } from 'react';
import { useDidMount, useLazyRef } from 'react-hook-utilities';
import { Alert } from 'react-native';

import t, { AdDiscountAlert as strings } from '@locales';
import { useAds } from '@hocs/withAds';

import IAP, { IAPErrorCodes } from 'src/models/iap';
import RewardedAd from 'src/models/rewardedAd';
import AdIds from 'src/models/ads';

export const buyAdFree = async (
  rewardedAd: MutableRefObject<RewardedAd>,
  setCanBuyDiscount: (_: boolean) => void,
  processPurchase: () => void,
) => {
  let loadRewardedAd: Promise<void> = Promise.reject();
  try {
    loadRewardedAd = rewardedAd.current.requestAdIfNeeded();
    return await IAP.buyAdFree();
  } catch (e) {
    try {
      if (e.code === IAPErrorCodes.cancelled) {
        await loadRewardedAd;
        Alert.alert(t(strings.title), t(strings.message), [
          {
            style: 'cancel',
            text: t(strings.cancel),
          },
          {
            onPress: async () => {
              await rewardedAd.current.showAd().finally(() => {
                rewardedAd.current = new RewardedAd(AdIds.rewarded);
              });
              setCanBuyDiscount(true);
              const result = await IAP.buyAdFreeDiscount();
              if (result) {
                processPurchase();
              }
            },
            text: t(strings.confirm),
          },
        ]);
      } else {
        // tslint:disable-next-line: no-console
        console.warn(e);
      }
    } catch (e2) {
      if (__DEV__) {
        // tslint:disable-next-line: no-console
        console.warn(e2);
      }
    }
  }

  return false;
};

export const useAdsSettings = () => {
  const { checkIsAdFree } = useAds();
  const rewardedAd = useLazyRef(() => new RewardedAd(AdIds.rewarded));
  const [canBuyDiscount, setCanBuyDiscount] = useState(false);
  const [isAdFree, setIsAdFree] = useState(false);
  const [isIAPAvailable, setIsIAPAvailable] = useState(false);

  useDidMount(() => {
    /**
     * TODO
     * Interstitial ads have been temporarily removed while IAP is not working
     */
    // IAP.isAvailable.then(setIsIAPAvailable);
    setIsIAPAvailable(false);
  });

  const handleBuyAdFree = useCallback(async () => {
    const processPurchase = () => checkIsAdFree().then(setIsAdFree);
    const result = canBuyDiscount
      ? await IAP.buyAdFreeDiscount()
      : await buyAdFree(rewardedAd, setCanBuyDiscount, processPurchase);
    if (result) {
      await processPurchase();
    }
  }, [canBuyDiscount]);

  return { isAdFree, handleBuyAdFree, isIAPAvailable, canBuyDiscount };
};
