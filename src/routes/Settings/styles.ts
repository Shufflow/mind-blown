import { ViewStyle } from 'react-native';

import { Spacing, Layouts, Colors } from '@styles';

const styles = {
  container: (backgroundColor: string = Colors.white) => ({
    ...Layouts.container,
    backgroundColor,
  }),
  scrollViewContent: {
    ...Layouts.container,
    paddingVertical: Spacing.vertical.size_40,
  } as ViewStyle,

  itemMarginTop: {
    marginTop: Spacing.vertical.size_40,
  },
};

export default styles;
