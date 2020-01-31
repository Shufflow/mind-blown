import React, { useEffect } from 'react';
import { WebView } from 'react-native';

import RouteName from '@routes';
import pure from '@hocs/pure';
import withDoneButton from '@hocs/withDoneButton';
import Constants from '@utils/constants';

import AdBanner from '@components/AdBanner';

import AdIds from 'src/models/ads';
import Analytics from 'src/models/analytics';

const WebViewSource = { uri: Constants.licensesURL };

const Licenses = () => {
  useEffect(() => {
    // did mount
    Analytics.currentScreen(RouteName.Licenses);
  }, []);

  return (
    <React.Fragment>
      <WebView source={WebViewSource} />
      <AdBanner adUnitID={AdIds.licenses} />
    </React.Fragment>
  );
};

const Enhanced: any = pure(Licenses);
export default withDoneButton(Enhanced);
