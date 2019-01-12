import React from 'react';
import { Text } from 'react-native';

import { getFont } from 'src/models/assets';
import pure from 'src/utils/hocs/pure';

import Dev from 'src/components/Dev';

import styles from './styles';

interface Props {
  content: string;
  color: string;
}

const Phrase = ({ content, color }: Props): React.ReactElement<Props> => {
  const fontFamily = getFont();
  return (
    <React.Fragment>
      <Text style={[styles.text, { color, fontFamily }]} allowFontScaling>
        {content}
      </Text>
      <Dev style={{ color }}>fontFamily - {fontFamily}</Dev>
    </React.Fragment>
  );
};

export default pure(Phrase);
