import { Spacing, Layouts, Colors } from 'src/utils/styles';

const Constants = {
  googleButtonHeight: 48,
};

const styles = {
  container: (backgroundColor: string = Colors.white) => ({
    ...Layouts.container,
    backgroundColor,
    justifyContent: 'space-between',
  }),
  googleButton: {
    height: Constants.googleButtonHeight,
    marginTop: Spacing.size_30,
  },
  itemsContainer: {
    ...Layouts.container,
    paddingVertical: Spacing.size_40,
  },
};

export default styles;
