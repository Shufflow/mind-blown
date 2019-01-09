import { StyleSheet } from 'react-native';

import { Layouts, Spacing, Colors } from 'src/utils/styles';

const Constants = {
  addButtonRadius: 50,
  borderWidth: 1,
};

const styles = StyleSheet.create({
  container: {
    ...Layouts.container,
  },
  scrollViewContent: {
    padding: Spacing.size_20,
    paddingBottom: Spacing.size_40,
  },
  text: {
    fontSize: Spacing.size_20,
    marginBottom: Spacing.size_10,
  },

  plusButton: {
    alignSelf: 'flex-start',
    borderColor: Colors.darkGray,
    borderRadius: Constants.addButtonRadius,
    borderWidth: Constants.borderWidth,
    height: Spacing.size_15,
    marginTop: Spacing.size_30,
    width: Spacing.size_15,
  },
});

export default styles;
