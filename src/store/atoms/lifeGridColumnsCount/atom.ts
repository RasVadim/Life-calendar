import { atom } from 'jotai';

import { LIFE_GRID_ZOOM_LEVELS } from '@/constants';

const defaultZoom = LIFE_GRID_ZOOM_LEVELS[LIFE_GRID_ZOOM_LEVELS.length - 1];

export const LifeGridColumnsCount = atom<number>(defaultZoom);
