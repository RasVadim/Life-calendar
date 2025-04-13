import { LIFE_GRID_ZOOM_LEVELS } from '@/constants';

export const ZOOM_STEP = 1; // higher value = faster zoom

export const getNextZoomLevelSetter = (direction: 1 | -1) => {
  const setter = (prevCols: number) => {
    const newZoom = prevCols + (direction > 0 ? ZOOM_STEP : -ZOOM_STEP);

    const minZoom = LIFE_GRID_ZOOM_LEVELS[0];
    const maxZoom = LIFE_GRID_ZOOM_LEVELS[LIFE_GRID_ZOOM_LEVELS.length - 1];

    const clampedZoom = Math.max(Math.min(newZoom, maxZoom), minZoom);

    return clampedZoom;
  };

  return setter;
};
