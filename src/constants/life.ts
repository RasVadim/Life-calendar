export const LIFE_MODES = {
  MONTHS: 'months',
  SEASONS: 'seasons',
  YEARS: 'years',
};

export const LIFE_GRID_ZOOM_LEVELS = {
  [LIFE_MODES.MONTHS]: 4,
  [LIFE_MODES.SEASONS]: 13,
  [LIFE_MODES.YEARS]: 52,
};

export const DEFAULT_BIRTH_DATE = '1990-05-10';

export const DEFAULT_LIFE_SPAN_YEARS = 90;

export const HOLIDAY_NAMES = {
  newYear: 'newYear',
  birthday: 'birthday',
  Feb23: '23Feb',
  Mar8: '8Mar',
} as const;