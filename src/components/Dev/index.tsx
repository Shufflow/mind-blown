import React from 'react';
import { RegisteredStyle, Text } from 'react-native';

import styles from './styles';

interface Props {
  children: React.ReactNode[];
  style?: RegisteredStyle<any>;
}

const Dev = ({ children, style }: Props): React.ReactElement<Props> | null => {
  if (!__DEV__) {
    return null;
  }

  return <Text style={[styles.container, style]}>{children}</Text>;
};

export default Dev;
