import { Application, Container } from 'pixi.js';

import { IDrawWeekIndexes } from '@/store/clientDB';
import { ELifeMode, TMediaDatesMap, TMedia, TTodayData, TZodiacIconSet } from '@/types';

// Theme palette: map of semantic color keys to HEX strings
export type TTheme = Record<string, string>;

export type TLifeGridState = {
  drawWeekIndexes: IDrawWeekIndexes;
  today: TTodayData;
  media: TMediaDatesMap<TMedia>;
  theme: TTheme;
  isScreenMedium: boolean;
  lifeMode: ELifeMode;
  zodiacIconSet?: TZodiacIconSet;
  container: HTMLDivElement | null;
  app: Application | null;
  scrollContainer: Container | null;
};
