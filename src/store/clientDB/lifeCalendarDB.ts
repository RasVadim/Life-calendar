import Dexie, { Table } from 'dexie';

import {
  IWeek,
  IDrawWeekIndexes,
  IUserData,
  ISettings,
  IHoliday,
  IMeta,
  IMedia,
  IFileBlob,
  IThumbnailBlob,
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
  fileBlobs!: Table<IFileBlob, string>;
  thumbnails!: Table<IThumbnailBlob, string>;

  constructor() {
    super('LifeCalendarDB'); // Name of the database in IndexedDB
    this.version(1).stores({
      weeks: 'id, index, dateStart, dateEnd, type, month, season', // Create 'weeks' table with primary key 'id' and indexes on 'dateStart', 'dateEnd', 'type', 'month', 'season'
      drawWeekIndexes: 'id', // Create 'drawWeekIndexes' table with primary key 'id'
      userData: 'id', // Create 'userData' table with primary key 'id'
      settings: 'id', // Create 'settings' table with primary key 'id'
      holidays: 'name', // Create 'holidays' table with primary key 'name'
      meta: 'id', // Create 'meta' table for global app info
      media: 'id', // Create 'media' table with primary key 'id'
      fileBlobs: 'id', // Create 'fileBlobs' table for storing file blobs
      thumbnails: 'id', // Create 'thumbnails' table for storing file blobs
    });
  }
}

// Export singleton instance of the database
export const lifeCalendarDB = new LifeCalendarDB();
