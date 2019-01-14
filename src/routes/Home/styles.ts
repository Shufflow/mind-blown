import { StyleSheet } from 'react-native';

import { Layouts, Spacing } from 'src/utils/styles';

const styles = StyleSheet.create({
  container: {
    ...Layouts.container,
  },
  content: {
    ...Layouts.container,
    justifyContent: 'space-between',
  },
  footer: {
    ...Layouts.horizontal,
    ...Layouts.fullWidth,
    justifyContent: 'space-between',
  },
  settingsButton: {
    alignSelf: 'flex-end',
    height: Spacing.size_20,
    width: Spacing.size_20,
  },
});

export default styles;
