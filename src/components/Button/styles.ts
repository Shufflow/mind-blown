import { StyleSheet } from 'react-native';

import { Spacing, Colors } from '@styles';

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
    borderRadius: Constants.borderRadius,
  },
  shadow: Constants.shadow,
  text: {
    color: Colors.black,
    textAlign: 'center',
  },
});

export const themes = StyleSheet.create({
  [ButtonTheme.default]: {
    backgroundColor: Colors.lightGray,
    paddingHorizontal: Spacing.horizontal.size_20,
    paddingVertical: Spacing.vertical.size_20,
  },
  [ButtonTheme.minimalist]: {
    backgroundColor: 'transparent',
    paddingHorizontal: Spacing.horizontal.size_10,
    paddingVertical: Spacing.vertical.size_10,
  },
});

export default styles;
