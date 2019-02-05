import React from 'react';
import { Text } from 'react-native';

import Dev from '@components/Dev';
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
    <React.Fragment>
      <Text style={[styles.text, { color, fontFamily }]} allowFontScaling>
        {content}
      </Text>
      <Dev style={{ color }}>fontFamily - {fontFamily}</Dev>
    </React.Fragment>
  );
};

export default pure(Phrase);
