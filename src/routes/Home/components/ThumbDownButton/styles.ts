import { StyleSheet } from 'react-native';

import { Spacing } from 'src/utils/styles';

const styles = StyleSheet.create({
  container: {
    padding: Spacing.size_10,
    transform: [{ rotateX: '180deg' }],
  },
});

export default styles;
