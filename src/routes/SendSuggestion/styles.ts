import { Colors, Layouts, Spacing } from '@styles';

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
    color: Colors.black,
    fontSize: Spacing.size_20,
    height: Constants.textInputHeight,
    margin: Spacing.size_20,
    padding: Spacing.size_10,
    textAlignVertical: 'top',
  },

  loading: {
    marginHorizontal: Spacing.size_10,
  },
};

export default styles;
