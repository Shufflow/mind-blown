import React from 'react';
import { WebView } from 'react-native';

import pure from 'src/utils/hocs/pure';
import { goBack } from 'src/utils/navigation';
import t, { Global as strings } from 'src/locales';

import { ColoredScreenProps } from 'src/navigators/SettingsNavigator/types';

import HeaderButton from 'src/components/HeaderButton';
import Constants from 'src/utils/constants';

const Licenses = () => <WebView source={{ uri: Constants.licensesURL }} />;

const Enhanced: any = pure(Licenses);
Enhanced.navigationOptions = (props: ColoredScreenProps) => ({
  headerRight: (
    <HeaderButton color={props.navigation.color.light} onPress={goBack(props)}>
      {t(strings.done)}
    </HeaderButton>
  ),
});

export default Enhanced;
