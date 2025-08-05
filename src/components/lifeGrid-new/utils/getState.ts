import { DEVICE_SCREEN_WIDTH } from '@/constants';
import { LOCAL_STORAGE_KEYS } from '@/store/localStorage';

import { LAST_WEEK_INDEX, LIFE_GRID_DEFAULT_STATE } from '../constants';
import { TLifeGridState } from '../types';

let cachedState: TLifeGridState | null = null;

/**
 * Get the state of the life grid.
 * @returns The state of the life grid.
 */
export const getState = (): TLifeGridState => {
  if (cachedState) return cachedState;

  // Check if we're in browser environment
  if (!localStorage) {
    cachedState = LIFE_GRID_DEFAULT_STATE;
    return cachedState;
  }

  const lastWeekIndex = localStorage.getItem(LOCAL_STORAGE_KEYS.LAST_WEEK_INDEX);
  const yearsIndxs = localStorage.getItem(LOCAL_STORAGE_KEYS.YEARS_INDXS);
  const yearRows = localStorage.getItem(LOCAL_STORAGE_KEYS.YEAR_ROWS);

  const fastRenderData = {
    lastWeekIndex: lastWeekIndex ? Number(lastWeekIndex) : LAST_WEEK_INDEX,
    yearsIndxs: yearsIndxs ? JSON.parse(yearsIndxs) : {},
    yearRows: yearRows ? Number(yearRows) : 90,
  };

  const isScreenMedium = window.innerWidth < DEVICE_SCREEN_WIDTH.medium;

  cachedState = {
    ...LIFE_GRID_DEFAULT_STATE,
    drawWeekIndexes: {
      ...LIFE_GRID_DEFAULT_STATE.drawWeekIndexes,
      ...fastRenderData,
    },
    isScreenMedium,
  };

  return cachedState;
};
