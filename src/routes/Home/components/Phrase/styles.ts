import { StyleSheet } from 'react-native';

import { Spacing, Typescale } from '@styles';
import { moderateScale } from '@utils/dimensions';

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.horizontal.size_30,
    paddingVertical: Spacing.vertical.size_20,
  },
  text: {
    fontSize: moderateScale(29),
    lineHeight: Typescale.size_45,
    textAlign: 'center',
  },
});

export default styles;
