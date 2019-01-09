import { StyleSheet } from 'react-native';

import { Spacing, Colors } from 'src/utils/styles';

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
    backgroundColor: Colors.lightGray,
    borderRadius: Constants.borderRadius,
    padding: Spacing.size_20,
  },
  text: {
    textAlign: 'center',
  },
});

export default styles;
