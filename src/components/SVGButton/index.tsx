import React, { ReactElement } from 'react';
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from 'react-native';
import SVGUri from 'react-native-svg-uri';

import pure from 'src/utils/hocs/pure';

import styles from './styles';

interface Props {
  color?: string;
  fillAll?: boolean;
  icon: string;
  onPress: () => void;
  style?: StyleProp<TextStyle>;
}

const SVGButton = ({
  color,
  fillAll,
  icon,
  onPress,
  style,
}: Props): ReactElement<Props> => {
  const { width, height, color: styleColor, ...flattenedStyle } =
    StyleSheet.flatten(style) || ({} as any);

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, flattenedStyle]}>
        <SVGUri
          fill={styleColor || color}
          fillAll={fillAll}
          height={height}
          svgXmlData={icon}
          width={width}
        />
      </View>
    </TouchableOpacity>
  );
};

export default pure(SVGButton);
