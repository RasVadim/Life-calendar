import { Application, Color } from 'pixi.js';

import { LIFE_MODES } from '@/constants';
import { IWeek } from '@/store/clientDB';
import { TLifeMode, TZodiacIconSet } from '@/types';

import { renderSeasonList } from './renderSeasosLIst';
import { renderYearList } from './renderYearList';

let cachedBackgroundColor: string | null = null;

type TRenderWeekListProps = {
  weeks: IWeek[];
  theme: Record<string, string>;
  width: number;
  height: number;
  gap?: number;
  app: Application;
  isMedium?: boolean;
  mode: TLifeMode;
  zodiacIconSet?: TZodiacIconSet;
};

/**
 * Renders weeks grid on the given PixiJS stage.
 * @param weeks - Array of week objects
 * @param theme - Theme palette
 * @param width - Width of the canvas
 * @param height - Height of the canvas
 * @param gap - Gap between cells
 * @param stage - PixiJS Container (usually app.stage)
 */
export const renderLife = ({
  weeks,
  theme,
  width,
  height,
  gap = 1.5,
  app,
  isMedium,
  mode,
  zodiacIconSet,
}: TRenderWeekListProps) => {
  // clear stage before rendering a new grid, to avoid artifacts
  if (app.stage && app.stage.removeChildren) {
    app.stage.removeChildren(); // remove all old elements
  }
  if (!weeks.length) return;

  if (cachedBackgroundColor !== theme.background) {
    const backgroundColor = new Color(theme.background);
    app.renderer.background.color = backgroundColor.toNumber();
    cachedBackgroundColor = theme.background;
  }

  if (mode === LIFE_MODES.SEASONS) {
    const scrollContainer = renderSeasonList({
      weeks,
      theme,
      width,
      gap,
      isMedium,
      mode,
      zodiacIconSet,
    });

    // add scrollable container to stage
    app.stage.addChild(scrollContainer);
    // Important: scrollContainer.y can be changed for scrolling (wheel/touch processing — outside this function)
    return scrollContainer;
  }

  // --- mode: years (default) ---
  renderYearList({
    weeks,
    theme,
    width,
    height,
    gap,
    isMedium,
    stage: app.stage,
    mode,
    zodiacIconSet,
  });
};
