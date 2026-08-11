import {
  THolidayName,
  ESeason,
  EWeekType,
  TWeekZodiac,
  EHolidayType,
  EZodiacMode,
  EThemeMode,
  TLanguage,
  TDay,
  TWeekIndxsMap,
  EYearsWeekIndxsValues,
  ESide,
  TMedia,
  TMediaDatesMap,
  TMonthsIndxsValue,
  TSeasonsIndxsValue,
} from '@/types';

export interface IHoliday {
  name: THolidayName;
  date: string; // ISO string
  type: EHolidayType;
}

// Type for a week entity
export interface IWeek {
  id: string;
  dateStart: string;
  dateEnd: string;
  type: EWeekType;
  month: string;
  secondMonth: string | null;
  season: ESeason;
  secondSeason: ESeason | null;
  year: string;
  secondYear: string | null;
  lifeYear: number;
  secondLifeYear: number | null;
  lifeMonth: number;
  isLeapYear: boolean;
  media: string | null;
  holidays: THolidayName[] | null;
  yearZodiacLabel: TWeekZodiac | null;
  photoUrl?: string;
  photoLocalPath?: string;
  comments: string | null;
  description: string | null;
  days: TDay[];
}

export interface IDrawWeekIndexes {
  id: string;
  yearsIndxs: TWeekIndxsMap<EYearsWeekIndxsValues>;
  seasonsIndxs: TWeekIndxsMap<TSeasonsIndxsValue>;
  monthsIndxs: TWeekIndxsMap<TMonthsIndxsValue>;
  holidaysIndxs: TWeekIndxsMap<THolidayName>;
  seasonOffset: number;
  monthOffset: number;
  yearRows: number;
  lastWeekIndex: number;
}

// Type for user data entity
export interface IUserData {
  id: string; // unique id, for example 'main' or user id
  birthDate: string | null; // user's birth date (ISO string)
  lifeExpectancy: number | null; // expected lifespan in years
  deathDate: string | null; // calculated death date (ISO string)
  timezone?: string | null; // user's timezone (e.g. 'Europe/Moscow', 'America/New_York')
}

// Meta entity for storing global app info
export interface IMeta {
  id: string;
  todayWeekId: string;
  todayWeekIndex: number;
  todayWeekYearHalf: ESide | null;
  todayDayId: string;
  todayDayIndex: number;
}

// Type for user settings entity
export interface ISettings {
  id: string; // unique id, for example 'main' or user id
  theme: EThemeMode;
  language: TLanguage;
  zodiacMode: EZodiacMode;
}

// Type for media entity
export interface IMedia {
  id: string; // unique id, for example 'main' or user id
  media: TMediaDatesMap<TMedia>;
}
