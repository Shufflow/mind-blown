import React from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';

import pure from 'src/utils/hocs/pure';

import styles from './styles';

interface Props {
  children?: React.ReactNode;
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const renderChildren = (children: React.ReactNode) => {
  const isStringArray =
    Array.isArray(children) &&
    children.reduce(
      (res: boolean, cur): boolean => res && typeof cur === 'string',
      true,
    );

  if (typeof children === 'string' || isStringArray) {
    return <Text style={styles.label}>{children}</Text>;
  }

  return children;
};

const Item = ({
  children,
  label,
  onPress,
  style,
}: Props): React.ReactElement<Props> => (
  <TouchableOpacity onPress={onPress} disabled={!onPress}>
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      {renderChildren(children)}
    </View>
  </TouchableOpacity>
);

export default pure(Item);
