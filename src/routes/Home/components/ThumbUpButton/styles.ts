import { StyleSheet } from 'react-native';

import { moderateScale } from '@utils/dimensions';

const Constants = {
  size: moderateScale(30),
};

const styles = StyleSheet.create({
  container: {
    height: Constants.size,
    width: Constants.size,
  },
});

export default styles;
