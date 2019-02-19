import { horizontalScale, verticalScale, moderateScale } from './dimensions';

export const Colors = {
  black: 'black',
  darkGray: '#777',
  gray: '#AAA',
  lightGray: '#D0D0D0',
  lightGreen: '#D6FFD6',
  lightRed: '#FFD6D6',
  offWhite: '#F8F8F8',
  white: 'white',
};

export const Layouts: any = {
  absolute: {
    position: 'absolute',
  },
  bottomBorder: (borderColor: string = Colors.offWhite) => ({
    borderColor,
    borderBottomWidth: 1,
  }),
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  fullWidth: {
    width: '100%',
  },
  horizontal: {
    flexDirection: 'row',
  },
  horizontalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
};

export const Spacing = {
  horizontal: {
    size_0: horizontalScale(0),
    size_05: horizontalScale(5),
    size_10: horizontalScale(10),
    size_15: horizontalScale(15),
    size_20: horizontalScale(20),
    size_30: horizontalScale(30),
    size_40: horizontalScale(40),
    size_45: horizontalScale(45),
  },
  vertical: {
    size_0: verticalScale(0),
    size_05: verticalScale(5),
    size_10: verticalScale(10),
    size_15: verticalScale(15),
    size_20: verticalScale(20),
    size_30: verticalScale(30),
    size_40: verticalScale(40),
    size_45: verticalScale(45),
  },
};

export const Typescale = {
  size_15: moderateScale(15),
  size_20: moderateScale(20),
  size_30: moderateScale(30),
  size_40: moderateScale(40),
  size_45: moderateScale(45),
};
