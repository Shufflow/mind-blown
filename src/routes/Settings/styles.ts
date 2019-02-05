import { ViewStyle } from 'react-native';

import { Spacing, Layouts, Colors } from '@styles';

const styles = {
  container: (backgroundColor: string = Colors.white) => ({
    ...Layouts.container,
    backgroundColor,
  }),
  scrollViewContent: {
    ...Layouts.container,
    justifyContent: 'space-between',
    paddingVertical: Spacing.size_40,
  } as ViewStyle,

  itemsContainer: {
    ...Layouts.container,
  },

  itemMarginTop: {
    marginTop: Spacing.size_40,
  },

  footerContainer: {
    marginTop: Spacing.size_40,
  },
  footerLink: {
    padding: Spacing.size_05,
  },
  footerLinkText: {
    color: Colors.black,
  },
};

export default styles;
