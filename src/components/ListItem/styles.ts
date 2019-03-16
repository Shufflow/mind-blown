import { StyleSheet } from 'react-native';

import { Colors, Layouts, Spacing, Typescale } from '@styles';

const styles = StyleSheet.create({
  container: {
    ...Layouts.horizontal,
    ...Layouts.bottomBorder(Colors.lightGray),
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.horizontal.size_20,
    paddingVertical: Spacing.vertical.size_20,
  },
  disabled: {
    color: Colors.lightGray,
  },
  label: {
    color: Colors.black,
    fontSize: Typescale.size_15,
  },
});

export default styles;
