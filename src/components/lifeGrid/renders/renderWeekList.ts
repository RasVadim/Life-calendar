import { Container } from 'pixi.js';

import { LIFE_MODES } from '@/constants';
import { IWeek } from '@/store/clientDB';
import { TLifeMode } from '@/types';

import { renderSeasonList } from './renderSeasosLIst';
import { renderYearList } from './renderYearList';

type TRenderWeekListProps = {
  weeks: IWeek[];
  theme: Record<string, string>;
  width: number;
  height: number;
  gap?: number;
  stage: Container;
  isMedium?: boolean;
  mode: TLifeMode;
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
export function renderWeekList({
  weeks,
  theme,
  width,
  height,
  gap = 1.5,
  stage,
  isMedium,
  mode,
}: TRenderWeekListProps) {
  // clear stage before rendering a new grid, to avoid artifacts
  if (stage && stage.removeChildren) {
    stage.removeChildren(); // remove all old elements
  }
  if (!weeks.length) return;

  if (mode === LIFE_MODES.SEASONS) {
    const scrollContainer = renderSeasonList({
      weeks,
      theme,
      width,
      gap,
      isMedium,
      mode,
    });

    // add scrollable container to stage
    stage.addChild(scrollContainer);
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
    stage,
    mode,
  });
}
