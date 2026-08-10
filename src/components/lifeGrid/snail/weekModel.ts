import { IDrawWeekIndexes } from '@/store/clientDB';
import { EWeekType, THolidayName, TTodayData } from '@/types';

import { getWeekType } from '../utils';

/**
 * Per-week payload carried through snail scenes.
 * `index` is the stable identity used to match a week across layout modes,
 * so the same model array must feed every scene to enable morphing.
 */
export type TWeekModel = {
  index: number;
  weekType: EWeekType;
  holiday: THolidayName | null;
  isPreview: boolean;
};

/**
 * Build the canonical, index-ordered model list from draw indexes.
 * One model per week in `[0, lastWeekIndex]` — inclusive of the real death week.
 */
export const buildWeekModels = (draw: IDrawWeekIndexes, today: TTodayData): TWeekModel[] => {
  const models: TWeekModel[] = [];

  for (let index = 0; index <= draw.lastWeekIndex; index += 1) {
    models.push({
      index,
      weekType: getWeekType(index, today.todayWeekIndex),
      holiday: draw.holidaysIndxs[index] ?? null,
      isPreview: false,
    });
  }

  return models;
};
