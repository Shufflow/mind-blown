import React from 'react';
import { WebView } from 'react-native';

import pure from '@hocs/pure';
import withDoneButton from '@hocs/withDoneButton';
import Constants from '@utils/constants';

import AdBanner from '@components/AdBanner';

import AdIds from 'src/models/ads';

const WebViewSource = { uri: Constants.licensesURL };

const Licenses = () => (
  <React.Fragment>
    <WebView source={WebViewSource} />
    <AdBanner adUnitID={AdIds.licenses} />
  </React.Fragment>
);

const Enhanced: any = pure(Licenses);
export default withDoneButton(Enhanced);
