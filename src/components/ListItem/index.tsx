import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import pure from 'src/utils/hocs/pure';

import styles from './styles';

interface Props {
  label: string;
  onPress: () => void;
  value?: string;
}

const Item = ({ label, onPress, value }: Props): React.ReactElement<Props> => (
  <TouchableOpacity onPress={onPress}>
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {!!value && <Text>{value}</Text>}
    </View>
  </TouchableOpacity>
);

export default pure(Item);
