import React from 'react';
import { BannerAd, BannerAdSize, TestIds } from '@react-native-firebase/admob';
import { compose } from '@typed/compose';

import { AdsConsumerProps, withAds } from '@hocs/withAds';
import pure from '@hocs/pure';

interface Props {
  adUnitID: string;
}

const onFailToLoadAd = (e: Error) => {
  if (__DEV__) {
    // tslint:disable-next-line: no-console
    console.warn(e);
  }
};

const AdBanner = ({ adUnitID, showAds }: Props & AdsConsumerProps) => {
  if (!showAds) {
    return null;
  }

  return (
    <BannerAd
      unitId={__DEV__ ? TestIds.BANNER : adUnitID}
      size={BannerAdSize.FULL_BANNER}
      onAdFailedToLoad={onFailToLoadAd}
    />
  );
};

const enhance = compose(
  pure,
  withAds,
);
export default enhance(AdBanner) as React.ComponentType<Props>;
