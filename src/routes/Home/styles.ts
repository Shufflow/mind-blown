import { StyleSheet } from 'react-native';

import { Layouts } from 'src/utils/styles';

const styles = StyleSheet.create({
  content: {
    ...Layouts.container,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footer: {
    ...Layouts.horizontal,
    ...Layouts.fullWidth,
    justifyContent: 'space-between',
  },
});

export default styles;
