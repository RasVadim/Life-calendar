import { IWeek } from '@/store/clientDB';

export type TWeekMeta = Pick<
  IWeek,
  | 'isLeapYear'
  | 'isSeasonPreview'
  | 'isMonthPreview'
  | 'days'
  | 'month'
  | 'secondMonth'
  | 'year'
  | 'secondYear'
  | 'season'
  | 'secondSeason'
>;
