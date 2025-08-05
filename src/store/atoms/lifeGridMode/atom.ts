import { atom } from 'jotai';

import { ELifeMode } from '@/types';

const defaultMode = ELifeMode.Years;

export const LifeGridMode = atom<ELifeMode>(defaultMode);
