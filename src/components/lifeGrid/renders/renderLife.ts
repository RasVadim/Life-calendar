import { Container } from 'pixi.js';

import { ELifeMode } from '@/types';

import { renderMonthList } from './renderMonthList';
import { renderSeasonList } from './renderSeasonList';
import { renderYearList } from './renderYearList';
import { CONTAINER_LABELS } from '../constants';
import { TLifeGridState } from '../types';

/**
 * Renders weeks grid on the given PixiJS stage.
 */
export const renderLife = (state: TLifeGridState) => {
  const { app, drawWeekIndexes, lifeMode } = state;

  if (!app) return;

  // clear stage before rendering a new grid, to avoid artifacts
  if (app.stage && app.stage.removeChildren) {
    app.stage.removeChildren(); // remove all old elements
  }
  if (!drawWeekIndexes.lastWeekIndex) return;

  const weekContainer = new Container({
    label: CONTAINER_LABELS.weeks,
  });
  // Bake the grid into a GPU render group: scrolling (moving weekContainer.y)
  // becomes a single O(1) transform instead of re-traversing thousands of cells.
  weekContainer.enableRenderGroup();
  app.stage.addChild(weekContainer);

  if (lifeMode === ELifeMode.Seasons) {
    // Renders into the weekContainer just like years/months; scrolling is handled
    // by the native DOM scroller synced to the container (see SnailGrid).
    renderSeasonList(state);
  }

  if (lifeMode === ELifeMode.Years) {
    // --- mode: years (default) ---
    renderYearList(state);
  }

  if (lifeMode === ELifeMode.Months) {
    renderMonthList(state);
  }
};
