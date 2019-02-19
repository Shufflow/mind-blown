import { StyleSheet } from 'react-native';

import { Spacing, Typescale } from '@styles';

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.horizontal.size_30,
  },
  text: {
    fontSize: Typescale.size_40,
    lineHeight: Typescale.size_45,
    textAlign: 'center',
  },
});

export default styles;
