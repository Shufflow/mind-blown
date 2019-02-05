import { Spacing, Layouts, Colors } from '@styles';

const Constants = {
  googleButtonHeight: 48,
  switchContainerPadding: 13,
};

const styles = {
  container: (backgroundColor: string = Colors.white) => ({
    ...Layouts.container,
    backgroundColor,
    paddingVertical: Spacing.size_40,
  }),
  googleButton: {
    height: Constants.googleButtonHeight,
  },
  logout: {
    marginTop: Spacing.size_40,
  },
  switchContainer: {
    paddingVertical: Constants.switchContainerPadding,
  },

  footer: {
    ...Layouts.fullWidth,
    ...Layouts.absolute,
    bottom: Spacing.size_20,
    color: Colors.darkGray,
    textAlign: 'center',
  },
};

export default styles;
