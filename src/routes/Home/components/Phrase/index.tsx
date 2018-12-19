import React from 'react';
import { Text } from 'react-native';

import { getFont } from 'src/models/assets';
import pure from 'src/utils/hocs/pure';

import styles from './styles';

interface Props {
  content: string;
  color: string;
}

const Phrase = ({ content, color }: Props): React.ReactElement<Props> => (
  <Text
    style={[styles.text, { color, fontFamily: getFont() }]}
    allowFontScaling
  >
    {content}
  </Text>
);

export default pure(Phrase);
