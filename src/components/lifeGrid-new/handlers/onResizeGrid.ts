import { DEVICE_SCREEN_WIDTH } from '@/constants';

import { TLifeGridState } from '../types';
import { resizeGrid } from '../updaters';
import { getState } from '../utils';

export const onResizeGrid = () => {
  const state: TLifeGridState = getState();
  if (!state.app) return null;
  if (!state.app.stage) return null;

  state.isScreenMedium = window.innerWidth < DEVICE_SCREEN_WIDTH.medium;

  resizeGrid(state);
};
