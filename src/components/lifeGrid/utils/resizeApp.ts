import { Application } from 'pixi.js';

import { IWeek } from '@/store/clientDB';

import { renderWeekList } from './renderWeekList';

type TResizeAppProps = {
  app: Application;
  weeks: IWeek[];
  theme: Record<string, string>;
  gap?: number;
  isMedium?: boolean;
  mode: string;
};

/**
 * Resizes PixiJS application and redraws weeks grid.
 * @param app - PixiJS Application
 * @param weeks - Array of week objects
 * @param theme - Theme palette
 * @param gap - Gap between cells
 */
export function resizeApp({ app, weeks, theme, gap, isMedium, mode }: TResizeAppProps) {
  const width = app.renderer.width;
  const height = app.renderer.height;
  app.stage.removeChildren();
  renderWeekList({
    weeks,
    theme,
    width,
    height,
    gap,
    stage: app.stage,
    isMedium,
    mode,
  });
}
