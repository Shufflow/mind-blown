import { StyleSheet } from 'react-native';

import { Layouts, Spacing, Colors, Typescale } from '@styles';
import { moderateScale } from '@utils/dimensions';

const Constants = {
  settingsButtonSize: moderateScale(20),
};

const styles = StyleSheet.create({
  container: {
    ...Layouts.container,
  },
  header: {
    ...Layouts.horizontal,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.horizontal.size_05,
  },

  errorContainer: {
    paddingHorizontal: Spacing.horizontal.size_40,
  },
  errorTitle: {
    color: Colors.black,
    fontSize: Typescale.size_30,
    marginBottom: Spacing.vertical.size_30,
    textAlign: 'center',
  },
  phraseContainer: {
    ...Layouts.container,
    flexShrink: 1,
    justifyContent: 'center',
    marginHorizontal: Spacing.horizontal.size_30,
  },
  phraseText: {
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
  iconButton: {
    height: Constants.settingsButtonSize,
    width: Constants.settingsButtonSize,
  },
});

export default styles;
