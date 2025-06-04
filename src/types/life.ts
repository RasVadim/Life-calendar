import { HOLIDAY_NAMES } from '@/constants';
import type { IWeek } from '@/store/clientDB';

export enum EWeekType {
  Past = 'past',
  Present = 'present',
  Future = 'future',
}

export enum ESeason {
  Winter = 'winter',
  Spring = 'spring',
  Summer = 'summer',
  Autumn = 'autumn',
}

export enum EHolidayType {
  National = 'national',
  Religious = 'religious',
  Cultural = 'cultural',
  Seasonal = 'seasonal',
  Other = 'other',
}

export type THolidayName = (typeof HOLIDAY_NAMES)[keyof typeof HOLIDAY_NAMES];

export type TWeekZodiac =
  | 'rat'
  | 'ox'
  | 'tiger'
  | 'rabbit'
  | 'dragon'
  | 'snake'
  | 'horse'
  | 'goat'
  | 'monkey'
  | 'rooster'
  | 'dog'
  | 'pig';

export type TYear = {
  id: string;
  weeks: IWeek[];
};

export { HOLIDAY_NAMES };
