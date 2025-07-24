import { Application, Container } from 'pixi.js';

import { IWeek } from '@/store/clientDB';
import { TZodiacIconSet } from '@/types';

export type TLifeGridState = {
  weeks: IWeek[];
  theme: Record<string, string>;
  isMedium: boolean;
  lifeMode: string;
  zodiacIconSet?: TZodiacIconSet;
  container: HTMLDivElement | null;
  app: Application | null;
  scrollContainer: Container | null;
};
