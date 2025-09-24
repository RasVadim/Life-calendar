import { Container } from 'pixi.js';

import { ELifeMode } from '@/types';

import { renderMonthList, renderMonthList2 } from './renderMonthLIst';
import { renderSeasonList } from './renderSeasosLIst';
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
  app.stage.addChild(weekContainer);

  if (lifeMode === ELifeMode.Seasons) {
    const scrollContainer = renderSeasonList(state);

    if (!scrollContainer) return;

    // add scrollable container to stage
    app.stage.addChild(scrollContainer);
    // Important: scrollContainer.y can be changed for scrolling (wheel/touch processing — outside this function)
    return scrollContainer;
  }

  if (lifeMode === ELifeMode.Years) {
    // --- mode: years (default) ---
    renderYearList(state);
  }

  if (lifeMode === ELifeMode.Months) {
    renderMonthList2(state);
  }
};
