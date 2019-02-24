import React from 'react';
import { Text, View } from 'react-native';

import pure from '@hocs/pure';

import { getFont } from 'src/models/assets';

import styles from './styles';

interface Props {
  content: string;
  color: string;
}

const Phrase = ({ content, color }: Props): React.ReactElement<Props> => {
  const fontFamily = getFont();
  return (
    <View style={styles.container}>
      <Text
        style={[styles.text, { color, fontFamily }]}
        allowFontScaling
        adjustsFontSizeToFit
      >
        {content}
      </Text>
    </View>
  );
};

export default pure(Phrase);
