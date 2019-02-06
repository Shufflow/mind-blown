import { StyleSheet } from 'react-native';

import { Layouts, Colors } from '@styles';

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  loaderContainer: {
    ...Layouts.container,
    ...Layouts.centered,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});

export const LoaderColor = Colors.white;

export default styles;
