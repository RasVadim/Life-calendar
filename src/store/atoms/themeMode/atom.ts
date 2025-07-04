import { atomWithStorage } from 'jotai/utils';

import { EThemeMode } from '@/types';

export const ThemeMode = atomWithStorage<EThemeMode>('themeMode', EThemeMode.DARK);
