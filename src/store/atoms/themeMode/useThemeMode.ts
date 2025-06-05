import { useAtom, useSetAtom } from 'jotai';

import { ThemeMode } from './atom';

export const useThemeMode = () => useAtom(ThemeMode);

export const useSetThemeMode = () => useSetAtom(ThemeMode);
