import { StyleSheet } from 'react-native';
import { Layouts, Spacing, Colors } from 'src/utils/styles';

const Constants = {
  borderWidth: 1,
  inputHeight: 100,
  languageButtonWidth: 87,
  removeButtonRadius: 50,
};

const styles = StyleSheet.create({
  container: {
    ...Layouts.horizontal,
    marginTop: Spacing.size_20,
  },
  textInput: {
    ...Layouts.container,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGray,
    borderWidth: Constants.borderWidth,
    color: Colors.black,
    height: Constants.inputHeight,
    padding: Spacing.size_10,
    textAlignVertical: 'top',
  },

  buttonsContainer: {
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginRight: Spacing.size_10,
  },
  languageButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: Spacing.size_10,
    textAlign: 'center',
    width: Constants.languageButtonWidth,
  },
  removeButton: {
    borderColor: Colors.darkGray,
    borderRadius: Constants.removeButtonRadius,
    borderWidth: Constants.borderWidth,
    height: Spacing.size_15,
    width: Spacing.size_15,
  },
});

export default styles;
