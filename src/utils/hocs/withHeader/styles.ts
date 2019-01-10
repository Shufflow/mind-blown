import { Colors, Layouts, Spacing } from 'src/utils/styles';

const Constants = {
  shadow: {
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
};

const styles = {
  background: (backgroundColor: string = Colors.offWhite): any => ({
    backgroundColor,
    zIndex: 2,
  }),
  container: (backgroundColor: string = Colors.offWhite): any => ({
    ...Layouts.container,
    backgroundColor,
  }),
  header: (backgroundColor: string = Colors.offWhite): any => ({
    ...Layouts.horizontal,
    ...Layouts.fullWidth,
    ...Constants.shadow,
    backgroundColor,
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  }),
  headerMargin: {
    marginBottom: Spacing.size_40,
  },
  title: (color: string = Colors.black): any => ({
    color,
    fontSize: Spacing.size_20,
    margin: Spacing.size_20,
  }),

  doneButton: (color: string = Colors.black): any => ({
    color,
    fontWeight: '600',
    padding: Spacing.size_10,
  }),
};

export default styles;
