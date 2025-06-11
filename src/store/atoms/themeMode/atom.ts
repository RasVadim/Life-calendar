import { atomWithStorage } from 'jotai/utils';

export enum EThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
  EXPEREMENTAL = 'experimental',
  CUSTOM = 'custom',
  FUTURE = 'future',
}

export const ThemeMode = atomWithStorage<EThemeMode>('themeMode', EThemeMode.DARK);
