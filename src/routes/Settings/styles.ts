import { Spacing, Layouts, Colors } from 'src/utils/styles';

const Constants = {
  googleButtonHeight: 48,
};

const styles = {
  container: (backgroundColor: string = Colors.white) => ({
    ...Layouts.container,
    backgroundColor,
    paddingVertical: Spacing.size_40,
  }),
  googleButton: {
    height: Constants.googleButtonHeight,
    marginTop: Spacing.size_30,
  },
};

export default styles;
