import { Colors, Layouts, Spacing, Typescale } from '@styles';

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
    marginBottom: Spacing.vertical.size_40,
  },
  title: (color: string = Colors.black): any => ({
    color,
    fontSize: Typescale.size_20,
    marginHorizontal: Spacing.horizontal.size_20,
    marginVertical: Spacing.vertical.size_20,
  }),

  doneButton: (color: string = Colors.black): any => ({
    color,
    fontWeight: '600',
    paddingHorizontal: Spacing.horizontal.size_10,
    paddingVertical: Spacing.vertical.size_10,
  }),
};

export default styles;
