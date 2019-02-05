import React from 'react';
import { TouchableOpacity, Text, StyleProp, TextStyle } from 'react-native';

import pure from '@hocs/pure';

import styles, { themes } from './styles';
import { ButtonTheme } from './types';

export { ButtonTheme };

interface Props {
  children: React.ReactNode;
  hasShadow?: boolean;
  onPress: () => void;
  style?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
  theme?: ButtonTheme;
}

const Button = ({
  children,
  hasShadow = true,
  onPress,
  style,
  textStyle,
  theme = ButtonTheme.default,
}: Props): React.ReactElement<Props> => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.container, themes[theme], hasShadow && styles.shadow, style]}
  >
    <Text style={[styles.text, textStyle]}>{children}</Text>
  </TouchableOpacity>
);

export default pure(Button);
