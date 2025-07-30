import Dexie, { Table } from 'dexie';

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
} from '@/types';

// Тип праздника
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
  isSeasonPreview: boolean;
  isMonthPreview: boolean;
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
  monthsIndxs: TWeekIndxsMap<ESegmentsWeekIndxsValues>;
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
}

// Meta entity for storing global app info
export interface IMeta {
  id: string;
  todayWeekId: string;
  todayWeekIndex: number;
  todayWeekHalf: ESide | null;
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

// Dexie database class
export class LifeCalendarDB extends Dexie {
  weeks!: Table<IWeek, string>;
  drawWeekIndexes!: Table<IDrawWeekIndexes, string>;
  userData!: Table<IUserData, string>;
  settings!: Table<ISettings, string>;
  holidays!: Table<IHoliday, string>;
  meta!: Table<IMeta, string>;

  constructor() {
    super('LifeCalendarDB'); // Name of the database in IndexedDB
    this.version(1).stores({
      weeks: 'id, dateStart, dateEnd, type', // Create 'weeks' table with primary key 'id' and indexes on 'dateStart', 'dateEnd', 'type'
      drawWeekIndexes: 'id', // Create 'drawWeekIndexes' table with primary key 'id'
      userData: 'id', // Create 'userData' table with primary key 'id'
      settings: 'id', // Create 'settings' table with primary key 'id'
      holidays: 'name', // Create 'holidays' table with primary key 'name'
      meta: 'id', // Create 'meta' table for global app info
    });
  }
}

// Export singleton instance of the database
export const lifeCalendarDB = new LifeCalendarDB();
