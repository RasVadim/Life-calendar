import { ELifeMode } from '@/types';

export const ZODIAC_ICON_SIZE = 16;

export const GRID_GAP = {
  small: 1.5,
  large: 2.5,
};

// Years mode
export const QUADRATIC_WEEK_ROWS_LEVEL = 90;
export const PADDING_TOP = 45;
export const PADDING_BOTTOM = 74;
export const PADDING_DESKTOP = 3;

// Week
export const BORDER_RADIUS_MAP = {
  [ELifeMode.Years]: { small: 2, large: 3 },
  [ELifeMode.Seasons]: { small: 4, large: 6 },
  [ELifeMode.Months]: { small: 14, large: 22 },
};

export const BORDER_WIDTH_MAP = {
  [ELifeMode.Years]: { small: 1, large: 1 },
  [ELifeMode.Seasons]: { small: 1, large: 2 },
  [ELifeMode.Months]: { small: 2, large: 3 },
};
