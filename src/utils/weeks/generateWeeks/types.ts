import { IWeek } from '@/store/clientDB';
import { ESide, TDrawWeekIndexes, TMedia, TMediaDatesMap } from '@/types';

export interface IGenerateWeeksResult {
  weeks: IWeek[];
  today: {
    todayWeekId: string;
    todayWeekIndex: number;
    todayDayId: string;
    todayDayIndex: number;
    todayWeekYearHalf: ESide | null;
  };
  drawWeekIndexes: TDrawWeekIndexes;
  media: TMediaDatesMap<TMedia>;
}

export type TWeekMeta = Pick<
  IWeek,
  | 'isLeapYear'
  | 'media'
  | 'days'
  | 'month'
  | 'secondMonth'
  | 'year'
  | 'secondYear'
  | 'season'
  | 'secondSeason'
>;
