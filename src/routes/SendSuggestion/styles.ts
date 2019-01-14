import { Colors, Layouts, Spacing } from 'src/utils/styles';

const Constants = {
  borderWidth: 1,
  textInputHeight: '30%',
};

const styles = {
  container: (backgroundColor: string = Colors.white) => ({
    ...Layouts.container,
    backgroundColor,
    justifyContent: 'space-between',
    paddingTop: Spacing.size_40,
  }),
  textInput: {
    ...Layouts.flex,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGray,
    borderWidth: Constants.borderWidth,
    fontSize: Spacing.size_20,
    height: Constants.textInputHeight,
    margin: Spacing.size_20,
    padding: Spacing.size_10,
  },
};

export default styles;
