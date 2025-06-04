import { atom } from 'jotai';

import { EModalKeys } from '@/types';

export const openDrawerKeyAtom = atom<EModalKeys | null>(null);
