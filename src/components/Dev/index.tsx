import React from 'react';
import { Text, View, StyleProp } from 'react-native';

import styles from './styles';

interface Props {
  children: React.ReactNode | React.ReactNode[];
  isAbsolute?: boolean;
  style?: StyleProp<any>;
}

const Dev = ({
  isAbsolute,
  children,
  style,
}: Props): React.ReactElement<Props> | null => {
  if (!__DEV__) {
    return null;
  }

  const isStringArray =
    Array.isArray(children) &&
    children.reduce(
      (res: boolean, cur): boolean => res && typeof cur === 'string',
      true,
    );

  if (isStringArray) {
    return (
      <Text
        style={[
          styles.container,
          isAbsolute && styles.absolute,
          styles.text,
          style,
        ]}
      >
        {children}
      </Text>
    );
  }

  return <View style={[styles.container, style]}>{children}</View>;
};

Dev.defaultProps = {
  isAbsolute: true,
};

export default Dev;
