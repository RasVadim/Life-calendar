import Dexie, { Table } from 'dexie';

import {
  IWeek,
  IDrawWeekIndexes,
  IUserData,
  ISettings,
  IHoliday,
  IMeta,
  IMedia,
} from './interfaces';

// Dexie database class
export class LifeCalendarDB extends Dexie {
  weeks!: Table<IWeek, string>;
  drawWeekIndexes!: Table<IDrawWeekIndexes, string>;
  userData!: Table<IUserData, string>;
  settings!: Table<ISettings, string>;
  holidays!: Table<IHoliday, string>;
  meta!: Table<IMeta, string>;
  media!: Table<IMedia, string>;

  constructor() {
    super('LifeCalendarDB'); // Name of the database in IndexedDB
    this.version(1).stores({
      weeks: 'id, dateStart, dateEnd, type', // Create 'weeks' table with primary key 'id' and indexes on 'dateStart', 'dateEnd', 'type'
      drawWeekIndexes: 'id', // Create 'drawWeekIndexes' table with primary key 'id'
      userData: 'id', // Create 'userData' table with primary key 'id'
      settings: 'id', // Create 'settings' table with primary key 'id'
      holidays: 'name', // Create 'holidays' table with primary key 'name'
      meta: 'id', // Create 'meta' table for global app info
      media: 'id', // Create 'media' table with primary key 'id'
    });
  }
}

// Export singleton instance of the database
export const lifeCalendarDB = new LifeCalendarDB();
