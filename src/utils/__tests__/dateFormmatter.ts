import moment from 'moment';

import { getDate } from '../dateFormatter';

describe('get date', () => {
  const values = [
    { input: { year: 2019, month: 6, day: 28 }, output: '28/07/2019' },
    { input: { year: 2018, month: 11, day: 31 }, output: '31/12/2018' },
    { input: { year: 1900, month: 0, day: 1 }, output: '01/01/1900' },
    { input: { year: 1895, month: 10, day: 15 }, output: '15/11/1895' },
  ];

  values.forEach(({ input: { year, month, day }, output }) => {
    it(`formats dates - ${output}`, () => {
      const date = new Date(`${year}-${month + 1}-${day}`);

      const result = getDate(date);

      expect(result).toEqual(output);
    });
  });

  values.forEach(({ input, output }) => {
    it(`formats moments - ${output}`, () => {
      const date = moment.utc(input);

      const result = getDate(date);

      expect(result).toEqual(output);
    });
  });
});
