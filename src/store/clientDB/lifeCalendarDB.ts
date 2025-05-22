import Dexie, { Table } from 'dexie';

// Type for a week entity
export interface WeekEntity {
  id: string; // unique week id
  dateStart: string; // week start date (ISO string)
  dateEnd: string; // week end date (ISO string)
  type: 'past' | 'current' | 'future';
  photoUrl?: string;
  photoLocal?: string;
  isFirst?: boolean;
  isLast?: boolean;
  // ... other fields as needed
}

// Type for user settings entity
export interface UserDataEntity {
  id: string; // unique id, for example 'main' or user id
  birthDate: string | null; // user's birth date (ISO string)
  lifeExpectancy: number | null; // expected lifespan in years
  deathDate: string | null; // calculated death date (ISO string)
}

// Dexie database class
export class LifeCalendarDB extends Dexie {
  weeks!: Table<WeekEntity, string>;
  userData!: Table<UserDataEntity, string>;
  firstVisit: boolean = false; // true if user opens app for the first time
  isProfileCompleted: boolean = false; // true if user completed onboarding/profile

  constructor() {
    super('LifeCalendarDB'); // Name of the database in IndexedDB
    this.version(1).stores({
      weeks: 'id, dateStart, dateEnd, type', // Create 'weeks' table with primary key 'id' and indexes on 'dateStart', 'dateEnd', 'type'
      userData: 'id', // Create 'userData' table with primary key 'id'
    });
  }
}

// Export singleton instance of the database
export const lifeCalendarDB = new LifeCalendarDB();
