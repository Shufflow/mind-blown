import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import SVGUri from 'react-native-svg-uri';

import icons from 'src/assets/icons';
import pure from 'src/utils/hocs/pure';
import { Spacing } from 'src/utils/styles';

import styles from './styles';

interface Props {
  color: string;
  isSelected?: boolean;
  onPress: () => void;
}

const ThumbsUp = ({
  color,
  isSelected,
  onPress,
}: Props): React.ReactElement<Props> => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.container}>
      <SVGUri
        fill={color}
        fillAll
        height={Spacing.size_30}
        svgXmlData={isSelected ? icons.thumbsUpSolid : icons.thumbsUp}
        width={Spacing.size_30}
      />
    </View>
  </TouchableOpacity>
);

export default pure(ThumbsUp);
