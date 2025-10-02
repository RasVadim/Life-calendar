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
  ESegmentsWeekIndxsValues,
  EYearsWeekIndxsValues,
  ESide,
  TMedia,
  TMediaDatesMap,
  TMonthsIndxsValue,
} from '@/types';

export interface IHoliday {
  name: THolidayName;
  date: string; // ISO string
  type: EHolidayType;
}

export interface IWeek {
  id: string;
  index: number;
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
  seasonsIndxs: TWeekIndxsMap<ESegmentsWeekIndxsValues>;
  monthsIndxs: TWeekIndxsMap<TMonthsIndxsValue>;
  holidaysIndxs: TWeekIndxsMap<THolidayName>;
  seasonOffset: number;
  monthOffset: number;
  yearRows: number;
  lastWeekIndex: number;
}

export interface IUserData {
  id: string;
  birthDate: string | null;
  lifeExpectancy: number | null; // expected lifespan in years
  deathDate: string | null; // calculated death date (ISO string)
  timezone?: string | null; // user's timezone (e.g. 'Europe/Moscow', 'America/New_York')
}

export interface IMeta {
  id: string;
  todayWeekId: string;
  todayWeekIndex: number;
  todayWeekYearHalf: ESide | null;
  todayDayId: string;
  todayDayIndex: number;
}

export interface ISettings {
  id: string;
  theme: EThemeMode;
  language: TLanguage;
  zodiacMode: EZodiacMode;
}

export interface IMedia {
  id: string;
  media: TMediaDatesMap<TMedia>;
}

export interface IFileBlob {
  id: string;
  blob: Blob;
}
