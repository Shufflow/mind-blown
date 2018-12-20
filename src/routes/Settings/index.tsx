import React from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';

import styles from './styles';

interface Props {
  dismiss: () => void;
}

class Settings extends React.Component<Props> {
  render() {
    const { dismiss } = this.props;
    return (
      <TouchableWithoutFeedback onPress={dismiss}>
        <View style={styles.container} />
      </TouchableWithoutFeedback>
    );
  }
}

export default Settings;
