import React from 'react';
import { WebView } from 'react-native';

import t, { Global as strings } from '@locales';
import pure from '@hocs/pure';
import { goBack } from '@utils/navigation';
import Constants from '@utils/constants';

import HeaderButton from '@components/HeaderButton';

import { ColoredScreenProps } from 'src/navigators/SettingsNavigator/types';

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
