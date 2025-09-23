import { Application, Container } from 'pixi.js';

import { IDrawWeekIndexes } from '@/store/clientDB';
import { ELifeMode, TMediaDatesMap, TMedia, TTodayData, TZodiacIconSet } from '@/types';

export type TLifeGridState = {
  drawWeekIndexes: IDrawWeekIndexes;
  today: TTodayData;
  media: TMediaDatesMap<TMedia>;
  theme: Record<string, string>;
  isScreenMedium: boolean;
  lifeMode: ELifeMode;
  zodiacIconSet?: TZodiacIconSet;
  container: HTMLDivElement | null;
  app: Application | null;
  scrollContainer: Container | null;
};
