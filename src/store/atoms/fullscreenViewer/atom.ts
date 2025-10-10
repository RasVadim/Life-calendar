import { atom } from 'jotai';

import { TMediaItem } from '@/features/weekDetailDrawer/types';

export const fullscreenMediaAtom = atom<TMediaItem | null>(null);
