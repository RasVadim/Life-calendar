import { IDrawWeekIndexes, lifeCalendarDB } from '@/store/clientDB';

/**
 * Save draw week indexes to IndexedDB and save necessary fast render data to localStorage
 * @param drawWeekIndexes - Draw week indexes to save
 */
export const saveDBDrawWeekIndexes = async (drawWeekIndexes: Omit<IDrawWeekIndexes, 'id'>) => {
  await lifeCalendarDB.drawWeekIndexes.put({
    id: 'main', // default id
    ...drawWeekIndexes,
  });
};
