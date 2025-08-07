import { Container } from 'pixi.js';

import { ELifeMode } from '@/types';

import { renderSeasonList } from './renderSeasosLIst';
import { renderYearList } from './renderYearList';
import { CONTAINER_LABELS } from '../constants';
import { TLifeGridState } from '../types';
import { getCachedColor } from '../utils';

let cachedBackgroundColor: string | null = null;

/**
 * Renders weeks grid on the given PixiJS stage.
 */
export const renderLife = (state: TLifeGridState) => {
  const { app, drawWeekIndexes, theme, lifeMode } = state;

  if (!app) return;

  // clear stage before rendering a new grid, to avoid artifacts
  if (app.stage && app.stage.removeChildren) {
    app.stage.removeChildren(); // remove all old elements
  }
  if (!drawWeekIndexes.lastWeekIndex) return;

  if (cachedBackgroundColor !== theme.background) {
    const backgroundColor = getCachedColor(theme.background);
    app.renderer.background.color = backgroundColor.toNumber();
    cachedBackgroundColor = theme.background;
  }
  const weekContainer = new Container({
    label: CONTAINER_LABELS.weeks,
  });
  app.stage.addChild(weekContainer);

  if (lifeMode === ELifeMode.Seasons) {
    const scrollContainer = renderSeasonList(state);

    // add scrollable container to stage
    app.stage.addChild(scrollContainer);
    // Important: scrollContainer.y can be changed for scrolling (wheel/touch processing — outside this function)
    return scrollContainer;
  }

  // --- mode: years (default) ---
  renderYearList(state);
};
