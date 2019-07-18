import { TextStyle, ViewStyle } from 'react-native';

import { Layouts, Spacing, Colors, Typescale } from '@styles';
import { moderateScale } from '@utils/dimensions';

const Constants = {
  addButtonRadius: 50,
  borderWidth: 1,
  footerButtonWidth: '45%',
  plusButtonSize: moderateScale(15),
};

const styles = {
  container: (backgroundColor: string = Colors.white) => ({
    backgroundColor,
    ...Layouts.container,
  }),
  scrollViewContent: {
    ...Layouts.container,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.horizontal.size_20,
    paddingVertical: Spacing.vertical.size_40,
  },

  activityIndicator: {
    alignSelf: 'center',
  } as ViewStyle,
  content: {
    flex: 0,
  },
  text: {
    color: Colors.black,
    fontSize: Typescale.size_20,
    marginBottom: Spacing.vertical.size_10,
  },

  plusButton: {
    alignSelf: 'flex-start',
    borderColor: Colors.darkGray,
    borderRadius: Constants.addButtonRadius,
    borderWidth: Constants.borderWidth,
    height: Constants.plusButtonSize,
    marginTop: Spacing.vertical.size_30,
    width: Constants.plusButtonSize,
  } as TextStyle,

  footer: {
    ...Layouts.horizontal,
    justifyContent: 'space-between',
    marginTop: Spacing.vertical.size_30,
  },

  discardButton: {
    backgroundColor: Colors.lightRed,
    width: Constants.footerButtonWidth,
  },
  saveButton: {
    backgroundColor: Colors.lightGreen,
    width: Constants.footerButtonWidth,
  },

  empty: {
    color: Colors.black,
    fontSize: Typescale.size_40,
    marginTop: Spacing.vertical.size_40,
    textAlign: 'center',
  } as TextStyle,
};

export default styles;
