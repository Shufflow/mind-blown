import { Colors, Layouts, Spacing, Typescale } from '@styles';

const Constants = {
  borderWidth: 1,
  textInputHeight: '30%',
};

const styles = {
  container: (backgroundColor: string = Colors.white) => ({
    ...Layouts.container,
    backgroundColor,
    justifyContent: 'space-between',
    paddingTop: Spacing.vertical.size_40,
  }),
  textInput: {
    ...Layouts.flex,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGray,
    borderWidth: Constants.borderWidth,
    color: Colors.black,
    fontSize: Typescale.size_20,
    height: Constants.textInputHeight,
    marginHorizontal: Spacing.horizontal.size_20,
    marginVertical: Spacing.vertical.size_20,
    paddingHorizontal: Spacing.horizontal.size_10,
    paddingVertical: Spacing.vertical.size_10,
    textAlignVertical: 'top',
  },

  loading: {
    marginHorizontal: Spacing.horizontal.size_10,
  },
};

export default styles;
