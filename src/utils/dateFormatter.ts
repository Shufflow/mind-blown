import moment from 'moment';

export const getDate = (date: Date | moment.Moment): string =>
  moment.utc(date).format('DD/MM/YYYY');
