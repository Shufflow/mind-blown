import { StyleSheet } from 'react-native';

import { Spacing, Colors } from 'src/utils/styles';

import { ButtonTheme } from './types';

const Constants = {
  borderRadius: 3,
  shadow: {
    shadowOffset: {
      height: 2,
      width: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
};

const styles = StyleSheet.create({
  container: {
    ...Constants.shadow,
    borderRadius: Constants.borderRadius,
  },
  text: {
    textAlign: 'center',
  },
});

export const themes = StyleSheet.create({
  [ButtonTheme.default]: {
    backgroundColor: Colors.lightGray,
    padding: Spacing.size_20,
  },
  [ButtonTheme.minimalist]: {
    backgroundColor: 'transparent',
    padding: Spacing.size_10,
  },
});

export default styles;
