import { Application, Container } from 'pixi.js';

import { IDrawWeekIndexes } from '@/store/clientDB';
import { TTodayData, TZodiacIconSet } from '@/types';

export type TLifeGridState = {
  drawWeekIndexes: IDrawWeekIndexes;
  today: TTodayData;
  theme: Record<string, string>;
  isScreenMedium: boolean;
  lifeMode: string;
  zodiacIconSet?: TZodiacIconSet;
  container: HTMLDivElement | null;
  app: Application | null;
  scrollContainer: Container | null;
};

export type TFieldKey = keyof TLifeGridState;

export type TFieldListener<K extends TFieldKey> = (
  newValue: TLifeGridState[K],
  prevValue: TLifeGridState[K],
) => void;
