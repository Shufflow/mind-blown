import React from 'react';
import { Text, View, StyleProp } from 'react-native';

import pure from 'src/utils/hocs/pure';

import styles from './styles';

interface Props {
  children: React.ReactNode | React.ReactNode[];
  condition?: boolean;
  isAbsolute?: boolean;
  style?: StyleProp<any>;
}

const Dev = ({
  isAbsolute,
  condition = __DEV__,
  children,
  style,
}: Props): React.ReactElement<Props> | null => {
  if (!condition) {
    return null;
  }

  const isStringArray =
    Array.isArray(children) &&
    children.reduce(
      (res: boolean, cur): boolean => res && typeof cur === 'string',
      true,
    );

  if (typeof children === 'string' || isStringArray) {
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

export default pure(Dev);
