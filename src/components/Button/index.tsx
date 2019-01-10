import React from 'react';
import { TouchableOpacity, Text, StyleProp, TextStyle } from 'react-native';

import styles, { themes } from './styles';
import { ButtonTheme } from './types';

export { ButtonTheme };

interface Props {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<TextStyle>;
  textStyle?: StyleProp<TextStyle>;
  theme: ButtonTheme;
}

const Button = ({
  children,
  onPress,
  style,
  textStyle,
  theme,
}: Props): React.ReactElement<Props> => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.container, themes[theme], style]}
  >
    <Text style={[styles.text, textStyle]}>{children}</Text>
  </TouchableOpacity>
);

Button.defaultProps = {
  theme: ButtonTheme.default,
};

export default Button;
