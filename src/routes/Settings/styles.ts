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

  devItem: {
    marginTop: Spacing.size_40,
  },
  footerLinksContainer: {
    marginBottom: Spacing.size_20,
  },

  footerLink: {
    padding: Spacing.size_05,
  },
};

export default styles;
