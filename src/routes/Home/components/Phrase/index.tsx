import React from 'react';
import { Text } from 'react-native';

import styles from './styles';

interface Props {
  content: string;
}

const Phrase = ({ content }: Props): React.ReactElement<Props> => (
  <Text style={styles.text}>{content}</Text>
);

export default Phrase;
