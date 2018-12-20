import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import styles from './styles';

interface Props {
  label: string;
  onPress: () => void;
  value?: string;
}

class Item extends React.PureComponent<Props> {
  render() {
    const { label, onPress, value } = this.props;
    return (
      <TouchableOpacity onPress={onPress}>
        <View style={styles.container}>
          <Text style={styles.label}>{label}</Text>
          {!!value && <Text>{value}</Text>}
        </View>
      </TouchableOpacity>
    );
  }
}

export default Item;
