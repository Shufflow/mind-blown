import { StyleSheet } from 'react-native';
import { Layouts, Spacing } from 'src/utils/styles';

const styles = StyleSheet.create({
  absolute: {
    ...Layouts.absolute,
    bottom: Spacing.size_20,
  },
  container: {
    ...Layouts.fullWidth,
  },
  text: {
    textAlign: 'center',
  },
});

export default styles;
