export const Colors = {
  black: 'black',
  gray: '#AAA',
  lightGray: '#D0D0D0',
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
  size_0: 0,
  size_10: 10,
  size_15: 15,
  size_20: 20,
  size_30: 30,
  size_40: 40,
};
