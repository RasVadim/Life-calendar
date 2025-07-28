import { IDrawWeekIndexes, lifeCalendarDB } from '@/store/clientDB';

/**
 * Save draw week indexes to IndexedDB
 * @param drawWeekIndexes - Draw week indexes to save
 */
export const saveDrawWeekIndexes = async (drawWeekIndexes: Omit<IDrawWeekIndexes, 'id'>) => {
  await lifeCalendarDB.drawWeekIndexes.put({
    id: 'main', // Use 'main' as the default id
    ...drawWeekIndexes,
  });
};
