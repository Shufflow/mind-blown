import { StyleSheet } from 'react-native';

import { Layouts, Spacing, Colors } from 'src/utils/styles';

const styles = StyleSheet.create({
  container: {
    ...Layouts.container,
  },

  errorContainer: {
    paddingHorizontal: Spacing.size_40,
  },
  errorTitle: {
    color: Colors.black,
    fontSize: Spacing.size_30,
    marginBottom: Spacing.size_30,
    textAlign: 'center',
  },

  activityIndicator: {
    alignSelf: 'center',
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
