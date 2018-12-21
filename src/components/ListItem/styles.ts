import { StyleSheet } from 'react-native';
import { Colors, Layouts, Spacing } from 'src/utils/styles';

const styles = StyleSheet.create({
  container: {
    ...Layouts.horizontal,
    ...Layouts.bottomBorder(Colors.lightGray),
    backgroundColor: Colors.offWhite,
    justifyContent: 'space-between',
    padding: Spacing.size_20,
  },
  label: {
    fontSize: Spacing.size_15,
  },
});

export default styles;
