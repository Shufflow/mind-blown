import { TextStyle } from 'react-native';
import { Layouts, Spacing, Colors } from 'src/utils/styles';

const Constants = {
  addButtonRadius: 50,
  borderWidth: 1,
};

const styles = {
  container: (backgroundColor: string = Colors.white) => ({
    backgroundColor,
    ...Layouts.container,
  }),
  scrollViewContent: {
    padding: Spacing.size_20,
    paddingVertical: Spacing.size_40,
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
    flex: 1,
    justifyContent: 'space-between',
    marginTop: Spacing.size_30,
  },
  footerButton: {
    width: '45%',
  },

  empty: {
    fontSize: Spacing.size_40,
    marginTop: Spacing.size_40,
    textAlign: 'center',
  } as TextStyle,
};

export default styles;
