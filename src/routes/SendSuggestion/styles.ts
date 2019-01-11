import { Colors, Layouts, Spacing } from 'src/utils/styles';

const styles = {
  container: (backgroundColor: string = Colors.white) => ({
    ...Layouts.container,
    backgroundColor,
    paddingVertical: Spacing.size_40,
  }),
  textInput: {
    ...Layouts.flex,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    fontSize: Spacing.size_20,
    height: '30%',
    margin: Spacing.size_20,
    padding: Spacing.size_10,
  },
};

export default styles;
