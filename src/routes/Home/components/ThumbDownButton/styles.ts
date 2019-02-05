import { StyleSheet } from 'react-native';

import { Spacing } from '@styles';

const styles = StyleSheet.create({
  container: {
    height: Spacing.size_30,
    transform: [{ rotateX: '180deg' }],
    width: Spacing.size_30,
  },
});

export default styles;
