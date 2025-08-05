import { IDrawWeekIndexes, lifeCalendarDB } from '@/store/clientDB';
import { LOCAL_STORAGE_KEYS } from '@/store/localStorage';

/**
 * Save draw week indexes to IndexedDB and save necessary fast render data to localStorage
 * @param drawWeekIndexes - Draw week indexes to save
 */
export const saveDrawWeekIndexes = async (drawWeekIndexes: Omit<IDrawWeekIndexes, 'id'>) => {
  // Put fast render grid data to localStorage
  localStorage.setItem(
    LOCAL_STORAGE_KEYS.LAST_WEEK_INDEX,
    drawWeekIndexes.lastWeekIndex.toString(),
  );
  localStorage.setItem(LOCAL_STORAGE_KEYS.YEAR_ROWS, drawWeekIndexes.yearRows.toString());
  localStorage.setItem(LOCAL_STORAGE_KEYS.YEARS_INDXS, JSON.stringify(drawWeekIndexes.yearsIndxs));

  await lifeCalendarDB.drawWeekIndexes.put({
    id: 'main', // default id
    ...drawWeekIndexes,
  });
};
