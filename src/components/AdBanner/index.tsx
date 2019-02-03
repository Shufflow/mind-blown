import React from 'react';
import { AdMobBanner } from 'react-native-admob';
import { compose } from '@typed/compose';

import { AdsConsumerProps, withAds } from '@hocs/withAds';
import pure from '@hocs/pure';

import { BannerTestIds } from 'src/models/ads';

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
    <AdMobBanner
      adSize='fullBanner'
      adUnitID={adUnitID}
      testDevices={BannerTestIds}
      onAdFailedToLoad={onFailToLoadAd}
    />
  );
};

const enhance = compose(
  pure,
  withAds,
);
export default enhance(AdBanner) as React.ComponentType<Props>;
