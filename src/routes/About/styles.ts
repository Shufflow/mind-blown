import { ViewStyle } from 'react-native';

import { Colors, Layouts, Spacing } from '@styles';

const styles = {
  container: (backgroundColor: string = Colors.white) => ({
    ...Layouts.container,
    backgroundColor,
  }),
  scrollViewContent: {
    ...Layouts.container,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.horizontal.size_40,
    paddingVertical: Spacing.vertical.size_40,
  } as ViewStyle,

  itemMarginTop: {
    marginTop: Spacing.vertical.size_40,
  },

  footerContainer: {
    marginTop: Spacing.vertical.size_40,
  },
  footerLink: {
    paddingHorizontal: Spacing.horizontal.size_05,
    paddingVertical: Spacing.vertical.size_05,
  },
  footerLinkText: {
    color: Colors.black,
  },
};

export default styles;
