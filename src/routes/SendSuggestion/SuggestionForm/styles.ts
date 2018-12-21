import { StyleSheet } from 'react-native';
import { Colors, Layouts, Spacing } from 'src/utils/styles';

const styles = StyleSheet.create({
  container: {
    ...Layouts.flex,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGray,
    borderWidth: 1,
    fontSize: Spacing.size_20,
    height: '30%',
    margin: Spacing.size_20,
    padding: Spacing.size_10,
  },
});

export default styles;
