import { Colors, Layouts, Spacing } from 'src/utils/styles';

const styles = {
  background: (backgroundColor: string = Colors.offWhite): any => ({
    backgroundColor,
  }),
  container: (backgroundColor: string = Colors.offWhite): any => ({
    ...Layouts.container,
    backgroundColor,
  }),
  header: (backgroundColor: string = Colors.offWhite): any => ({
    ...Layouts.horizontal,
    ...Layouts.fullWidth,
    ...Layouts.bottomBorder(Colors.gray),
    backgroundColor,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.size_20,
  }),
  headerMargin: {
    marginBottom: Spacing.size_40,
  },
  title: (color: string = Colors.black): any => ({
    color,
    fontSize: Spacing.size_20,
  }),

  doneButton: (color: string = Colors.black): any => ({
    color,
    fontWeight: '600',
  }),
};

export default styles;
