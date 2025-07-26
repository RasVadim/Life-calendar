import { HOLIDAY_NAMES, LIFE_MODES } from '@/constants';
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

export enum EDayOfWeek {
  Sunday = 'sunday',
  Monday = 'monday',
  Tuesday = 'tuesday',
  Wednesday = 'wednesday',
  Thursday = 'thursday',
  Friday = 'friday',
  Saturday = 'saturday',
}

export enum EDateSegment {
  Year = 'year',
  Month = 'month',
  Season = 'season',
}

export type TDay = {
  id: string;
  date: string;
  dayOfWeek: EDayOfWeek;
  isWeekPreview: boolean;
  holidays: THolidayName[] | null;
  lifeDay: number;
  comments: string | null;
  description: string | null;
  photoUrl?: string;
  photoLocalPath?: string;
};

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

export type TLifeMode = (typeof LIFE_MODES)[keyof typeof LIFE_MODES];
