import { Colors, Layouts, Spacing } from 'src/utils/styles';

const styles = {
  pickerContainer: {
    ...Layouts.container,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },

  picker: (backgroundColor: string = Colors.white): any => ({
    backgroundColor,
  }),
  pickerBar: (backgroundColor: string = Colors.offWhite): any => ({
    ...Layouts.bottomBorder(Colors.lightGray),
    backgroundColor,
    padding: Spacing.size_10,
  }),
  pickerItem: (color: string = Colors.black): any => ({
    color,
  }),

  doneButton: (color: string = Colors.black): any => ({
    color,
    alignSelf: 'flex-end',
    fontWeight: '600',
    padding: Spacing.size_10,
  }),
};

export default styles;
