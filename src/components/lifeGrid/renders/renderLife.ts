import { Color } from 'pixi.js';

import { LIFE_MODES } from '@/constants';

import { renderSeasonList } from './renderSeasosLIst';
import { renderYearList } from './renderYearList';
import { TLifeGridState } from '../types';

let cachedBackgroundColor: string | null = null;

/**
 * Renders weeks grid on the given PixiJS stage.
 */
export const renderLife = (state: TLifeGridState) => {
  const { app, weeks, theme, lifeMode } = state;

  if (!app) return;

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

  if (lifeMode === LIFE_MODES.SEASONS) {
    const scrollContainer = renderSeasonList(state);

    // add scrollable container to stage
    app.stage.addChild(scrollContainer);
    // Important: scrollContainer.y can be changed for scrolling (wheel/touch processing — outside this function)
    return scrollContainer;
  }

  // --- mode: years (default) ---
  renderYearList(state);
};
