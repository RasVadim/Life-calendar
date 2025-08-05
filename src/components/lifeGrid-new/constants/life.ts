import { THEMES } from '@/constants';
import { IDrawWeekIndexes } from '@/store/clientDB';
import { ELifeMode, TTodayData } from '@/types';

export const LIFE_GRID_DEFAULT_STATE = {
  drawWeekIndexes: {} as IDrawWeekIndexes,
  today: {} as TTodayData,
  zodiacIconSet: undefined,
  theme: THEMES.dark,
  lifeMode: ELifeMode.Years,
  isScreenMedium: true,
  app: null,
  container: null,
  scrollContainer: null,
  fastRenderDataFilled: false,
} as const;

// weeks in 90 years
export const LAST_WEEK_INDEX = 4696;
