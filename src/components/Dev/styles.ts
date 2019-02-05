import { StyleSheet } from 'react-native';

import { Layouts, Spacing, Colors } from '@styles';

const styles = StyleSheet.create({
  absolute: {
    ...Layouts.absolute,
    bottom: Spacing.size_20,
  },
  container: {
    ...Layouts.fullWidth,
  },
  text: {
    color: Colors.black,
    textAlign: 'center',
  },
});

export default styles;
