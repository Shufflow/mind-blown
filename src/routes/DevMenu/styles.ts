import { Spacing, Layouts, Colors } from '@styles';
import { verticalScale } from '@utils/dimensions';

const Constants = {
  googleButtonHeight: 48,
  switchContainerPadding: verticalScale(13),
};

const styles = {
  container: (backgroundColor: string = Colors.white) => ({
    ...Layouts.container,
    backgroundColor,
    paddingVertical: Spacing.vertical.size_40,
  }),
  googleButton: {
    height: Constants.googleButtonHeight,
  },
  logout: {
    marginTop: Spacing.vertical.size_40,
  },
  switchContainer: {
    paddingVertical: Constants.switchContainerPadding,
  },

  footer: {
    ...Layouts.fullWidth,
    ...Layouts.absolute,
    bottom: Spacing.vertical.size_20,
    color: Colors.darkGray,
    textAlign: 'center',
  },
};

export default styles;
