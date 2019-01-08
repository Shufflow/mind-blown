import { StyleSheet } from 'react-native';
import { Layouts, Spacing } from 'src/utils/styles';

const styles = StyleSheet.create({
  container: {
    ...Layouts.absolute,
    ...Layouts.fullWidth,
    bottom: Spacing.size_20,
    textAlign: 'center',
  },
});

export default styles;
