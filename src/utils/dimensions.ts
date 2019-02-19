import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

const screenWidth = width;
const screenHeight = height;
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 667;

/**
 * Returns linear scaled result, based on device's screen width.
 * @param size
 */
const horizontalScale = (size: number): number =>
  (screenWidth / guidelineBaseWidth) * size;

/**
 * Returns linear scaled result, based on device's screen height.
 * @param size
 */
const verticalScale = (size: number): number =>
  (screenHeight / guidelineBaseHeight) * size;

/**
 * Returns non-linear scale based on a resize factor (defaults to 0.51).
 * If normal horizontalScale will increase by +2X,
 * moderateScale will only increase it by +X.
 * @param size
 * @param factor
 */
const moderateScale = (size: number, factor: number = 0.51): number =>
  size + (horizontalScale(size) - size) * factor;

export {
  horizontalScale,
  verticalScale,
  moderateScale,
  screenWidth,
  screenHeight,
};
