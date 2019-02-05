import { StyleSheet } from 'react-native';

import { Colors, Layouts, Spacing } from '@styles';

const styles = StyleSheet.create({
  container: {
    ...Layouts.horizontal,
    ...Layouts.bottomBorder(Colors.lightGray),
    alignItems: 'center',
    backgroundColor: Colors.offWhite,
    justifyContent: 'space-between',
    padding: Spacing.size_20,
  },
  label: {
    color: Colors.black,
    fontSize: Spacing.size_15,
  },
});

export default styles;
