import { atom } from 'jotai';

import { LIFE_GRID_ZOOM_LEVELS } from '@/constants';

const defaultZoom = LIFE_GRID_ZOOM_LEVELS.years;

export const LifeGridColumnsCount = atom<number>(defaultZoom);
