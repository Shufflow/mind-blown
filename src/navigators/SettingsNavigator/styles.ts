import { Colors, Spacing } from '@styles';

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
  header: (backgroundColor: string = 'transparent') => ({
    ...Constants.shadow,
    backgroundColor,
  }),
  text: (color: string = Colors.black) => ({
    color,
    fontSize: Spacing.size_20,
  }),
};

export default styles;
