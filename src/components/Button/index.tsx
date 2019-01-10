import React from 'react';
import { TouchableOpacity, Text, StyleProp, TextStyle } from 'react-native';

import styles from './styles';

interface Props {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<TextStyle>;
}

const Button = ({
  children,
  onPress,
  style,
}: Props): React.ReactElement<Props> => (
  <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
    <Text style={styles.text}>{children}</Text>
  </TouchableOpacity>
);

export default Button;
