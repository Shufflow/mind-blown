import { Spacing, Layouts, Colors } from 'src/utils/styles';
import { ViewStyle } from 'react-native';

const styles = {
  container: (backgroundColor: string = Colors.white) => ({
    ...Layouts.container,
    backgroundColor,
  }),
  scrollViewContent: {
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
