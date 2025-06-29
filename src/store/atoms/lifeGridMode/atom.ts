import { atom } from 'jotai';

import { LIFE_MODES } from '@/constants';
import { TLifeMode } from '@/types';

const defaultMode = LIFE_MODES.YEARS;

export const LifeGridMode = atom<TLifeMode>(defaultMode);
