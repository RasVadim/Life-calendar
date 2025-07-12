import { Application } from 'pixi.js';

import { IWeek } from '@/store/clientDB';
import { TLifeMode, TZodiacIconSet } from '@/types';

import { renderWeekList } from '../renders';

type TResizeAppProps = {
  app: Application;
  weeks: IWeek[];
  theme: Record<string, string>;
  gap?: number;
  isMedium?: boolean;
  mode: TLifeMode;
  zodiacIconSet: TZodiacIconSet;
};

/**
 * Resizes PixiJS application and redraws weeks grid.
 * @param app - PixiJS Application
 * @param weeks - Array of week objects
 * @param theme - Theme palette
 * @param gap - Gap between cells
 */
export function resizeApp({
  app,
  weeks,
  theme,
  gap,
  isMedium,
  mode,
  zodiacIconSet,
}: TResizeAppProps) {
  const width = app.renderer.width;
  const height = app.renderer.height;
  app.stage.removeChildren();
  const scrollContainer = renderWeekList({
    weeks,
    theme,
    width,
    height,
    gap,
    stage: app.stage,
    isMedium,
    mode,
    zodiacIconSet,
  });
  return scrollContainer;
}
