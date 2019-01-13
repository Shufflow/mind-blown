import { TextStyle } from 'react-native';
import { Layouts, Spacing, Colors } from 'src/utils/styles';

const Constants = {
  addButtonRadius: 50,
  borderWidth: 1,
  footerButtonWidth: '45%',
};

const styles = {
  container: (backgroundColor: string = Colors.white) => ({
    backgroundColor,
    ...Layouts.container,
  }),
  scrollViewContent: {
    ...Layouts.container,
    justifyContent: 'space-between',
    padding: Spacing.size_20,
    paddingVertical: Spacing.size_40,
  },

  content: {
    flex: 0,
  },
  text: {
    fontSize: Spacing.size_20,
    marginBottom: Spacing.size_10,
  },

  plusButton: {
    alignSelf: 'flex-start',
    borderColor: Colors.darkGray,
    borderRadius: Constants.addButtonRadius,
    borderWidth: Constants.borderWidth,
    height: Spacing.size_15,
    marginTop: Spacing.size_30,
    width: Spacing.size_15,
  } as TextStyle,

  footer: {
    ...Layouts.horizontal,
    justifyContent: 'space-between',
    marginTop: Spacing.size_30,
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
    fontSize: Spacing.size_40,
    marginTop: Spacing.size_40,
    textAlign: 'center',
  } as TextStyle,
};

export default styles;
