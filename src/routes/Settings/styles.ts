import { Spacing, Layouts, Colors } from 'src/utils/styles';

const styles = {
  container: (backgroundColor: string = Colors.white) => ({
    ...Layouts.container,
    backgroundColor,
    justifyContent: 'space-between',
  }),
  itemsContainer: {
    ...Layouts.container,
    paddingVertical: Spacing.size_40,
  },
};

export default styles;
