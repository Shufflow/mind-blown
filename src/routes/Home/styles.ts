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

  errorContainer: {
    paddingHorizontal: Spacing.horizontal.size_40,
  },
  errorTitle: {
    color: Colors.black,
    fontSize: Typescale.size_30,
    marginBottom: Spacing.vertical.size_30,
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
    height: Constants.settingsButtonSize,
    width: Constants.settingsButtonSize,
  },
});

export default styles;
