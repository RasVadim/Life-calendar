import { renderLife } from '../renders';
import { TLifeGridState } from '../types';

/**
 * Resizes PixiJS application and redraws weeks grid.
 * @param state - Current life grid state
 */
export const resizeApp = (state: TLifeGridState) => {
  if (!state.app) return null;
  if (!state.app.stage) return null;

  state.app.stage.removeChildren();
  const scrollContainer = renderLife(state);
  return scrollContainer;
};
