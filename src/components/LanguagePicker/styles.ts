import { Colors, Layouts, Spacing } from '@styles';

const styles = {
  pickerContainer: {
    ...Layouts.container,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },

  picker: (backgroundColor: string = Colors.white): any => ({
    backgroundColor,
    color: Colors.black,
  }),
  pickerBar: (backgroundColor: string = Colors.offWhite): any => ({
    ...Layouts.bottomBorder(Colors.lightGray),
    backgroundColor,
    paddingHorizontal: Spacing.horizontal.size_10,
    paddingVertical: Spacing.vertical.size_10,
  }),
  pickerItem: (color: string = Colors.black): any => ({
    color,
  }),

  doneButton: (color: string = Colors.black): any => ({
    color,
    alignSelf: 'flex-end',
    fontWeight: '600',
    paddingHorizontal: Spacing.horizontal.size_10,
    paddingVertical: Spacing.vertical.size_10,
  }),
};

export default styles;
