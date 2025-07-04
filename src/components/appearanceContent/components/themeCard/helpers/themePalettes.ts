import { THEMES } from '@/constants';
import { EThemeMode } from '@/types';

export type TThemePalette = {
  brandG1: string;
  brandG2: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  background: string;
  backgroundFront: string;
  whiteout: string;
  weekPast: string;
  weekPresent: string;
  weekFuture: string;
  newYear: string;
  birthday: string;
  feb23: string;
  mar8: string;
  contrast: string;
  oppositeContrast: string;
};

// Generate themePreviews dynamically from THEMES and EThemeMode
export const themePalettes = Object.values(EThemeMode).reduce(
  (acc, mode) => {
    const theme = THEMES[mode as unknown as keyof typeof THEMES];
    if (theme) {
      acc[mode as EThemeMode] = {
        brandG1: theme.brandG1,
        brandG2: theme.brandG2,
        primary: theme.primary,
        primaryLight: theme.primaryLight,
        primaryDark: theme.primaryDark,
        accent: theme.defaultWeekBg,
        background: theme.background,
        backgroundFront: theme.backgroundFront,
        whiteout: theme.whiteout,
        weekPast: theme.weekPast,
        weekPresent: theme.weekPresent,
        weekFuture: theme.weekFuture,
        newYear: theme.newYear,
        birthday: theme.birthday,
        feb23: theme.feb23,
        mar8: theme.mar8,
        contrast: theme.contrast,
        oppositeContrast: theme.oppositeContrast,
      };
    }
    return acc;
  },
  {} as Record<EThemeMode, TThemePalette>,
);
