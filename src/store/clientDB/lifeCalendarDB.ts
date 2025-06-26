import Dexie, { Table } from 'dexie';

import { THolidayName, ESeason, EWeekType, TWeekZodiac, EHolidayType } from '@/types';

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
  month: number;
  year: number;
  dateYear: string;
  dateMonth: string;
  dateSeason: ESeason | null;
  numberOfDays: number;
  isFirst: boolean;
  isLast: boolean;
  isFirstInYear: boolean;
  isLastInYear: boolean;
  isFirstInMonth: boolean;
  isLastInMonth: boolean;
  isExpandedByYear: boolean;
  isExpandedByDateSeason: boolean;
  isExpandedByDateMonth: boolean;
  isPartialByYear: boolean;
  isPartialByDateSeason: boolean;
  isPartialByDateMonth: boolean;
  isLeapYear: boolean;
  holidays: THolidayName[] | null;
  yearZodiacLabel: TWeekZodiac | null;
  photoUrl?: string;
  photoLocal?: string;
}

// Type for user settings entity
export interface UserDataEntity {
  id: string; // unique id, for example 'main' or user id
  birthDate: string | null; // user's birth date (ISO string)
  lifeExpectancy: number | null; // expected lifespan in years
  deathDate: string | null; // calculated death date (ISO string)
}

// Meta entity for storing global app info
export interface MetaEntity {
  id: string;
  todayWeekId: string;
}

// Dexie database class
export class LifeCalendarDB extends Dexie {
  weeks!: Table<IWeek, string>;
  userData!: Table<UserDataEntity, string>;
  holidays!: Table<IHoliday, string>;
  meta!: Table<MetaEntity, string>;

  constructor() {
    super('LifeCalendarDB'); // Name of the database in IndexedDB
    this.version(1).stores({
      weeks: 'id, dateStart, dateEnd, type', // Create 'weeks' table with primary key 'id' and indexes on 'dateStart', 'dateEnd', 'type'
      userData: 'id', // Create 'userData' table with primary key 'id'
      holidays: 'name', // Create 'holidays' table with primary key 'name'
      meta: 'id', // Create 'meta' table for global app info
    });
  }
}

// Export singleton instance of the database
export const lifeCalendarDB = new LifeCalendarDB();
