import { StyleSheet } from 'react-native';

import { Layouts, Spacing, Colors } from '@styles';
import {
  moderateScale,
  horizontalScale,
  verticalScale,
} from '@utils/dimensions';

const Constants = {
  borderWidth: 1,
  inputHeight: verticalScale(100),
  languageButtonWidth: horizontalScale(87),
  removeButtonRadius: 50,
  removeButtonSize: moderateScale(15),
};

const styles = StyleSheet.create({
  container: {
    ...Layouts.horizontal,
    marginTop: Spacing.vertical.size_20,
  },
  textInput: {
    ...Layouts.container,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGray,
    borderWidth: Constants.borderWidth,
    color: Colors.black,
    height: Constants.inputHeight,
    paddingHorizontal: Spacing.horizontal.size_10,
    paddingVertical: Spacing.vertical.size_10,
    textAlignVertical: 'top',
  },

  buttonsContainer: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginRight: Spacing.horizontal.size_10,
  },
  languageButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    paddingHorizontal: Spacing.horizontal.size_10,
    paddingVertical: Spacing.vertical.size_10,
    textAlign: 'center',
    width: Constants.languageButtonWidth,
  },
  removeButton: {
    borderColor: Colors.darkGray,
    borderRadius: Constants.removeButtonRadius,
    borderWidth: Constants.borderWidth,
    height: Constants.removeButtonSize,
    width: Constants.removeButtonSize,
  },
});

export default styles;
