import { useLiveQuery } from 'dexie-react-hooks';

import { lifeCalendarDB } from '@/store/clientDB';

import { IDrawWeekIndexes } from '../../interfaces';

/**
 * React hook to get week indexes for drawing from IndexedDB reactively
 * @returns {IDrawWeekIndexes} Draw week indexes
 */
export const useDBDrawWeekIndexes = (): IDrawWeekIndexes | undefined => {
  return useLiveQuery(() => lifeCalendarDB.drawWeekIndexes.toCollection().first(), []);
};
