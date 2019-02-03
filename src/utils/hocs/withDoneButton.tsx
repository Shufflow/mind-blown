import React from 'react';

import t, { Global as strings } from '@locales';
import { goBack } from '@utils/navigation';

import HeaderButton from '@components/HeaderButton';

import { ColoredScreenProps } from 'src/navigators/SettingsNavigator/types';

const withDoneButton = <Props extends ColoredScreenProps>(
  WrappedComponent: React.ComponentType<Props>,
  action: (props: Props) => () => void = goBack,
): React.ComponentType<Props> => {
  (WrappedComponent as any).navigationOptions = (props: Props) => ({
    headerRight: (
      <HeaderButton
        color={props.navigation.color.light}
        onPress={action(props)}
      >
        {t(strings.done)}
      </HeaderButton>
    ),
  });

  return WrappedComponent;
};

export default withDoneButton;
