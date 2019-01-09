import { StyleSheet } from 'react-native';

import { Spacing } from 'src/utils/styles';

const Constants = {
  googleButtonHeight: 48,
};

const styles = StyleSheet.create({
  googleButton: {
    height: Constants.googleButtonHeight,
    marginTop: Spacing.size_30,
  },
});

export default styles;
