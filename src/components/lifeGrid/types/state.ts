import { Application, Container } from 'pixi.js';

import { IDrawWeekIndexes } from '@/store/clientDB';
import { TTodayData, TZodiacIconSet } from '@/types';

export type TLifeGridState = {
  drawWeekIndexes: IDrawWeekIndexes;
  today: TTodayData;
  theme: Record<string, string>;
  isMedium: boolean;
  lifeMode: string;
  zodiacIconSet?: TZodiacIconSet;
  container: HTMLDivElement | null;
  app: Application | null;
  scrollContainer: Container | null;
};

export enum ESide {
  Left = 'left',
  Right = 'right',
}
