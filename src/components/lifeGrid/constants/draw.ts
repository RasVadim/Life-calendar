import { ELifeMode } from '@/types';

export const CONTAINER_LABELS = {
  weeks: 'weeks',
};

export const ZODIAC_ICON_SIZE = 16;

export const GRID_GAP = {
  small: 1.5,
  large: 2,
};

// Years mode
export const QUADRATIC_WEEK_ROWS_LEVEL = 90;
export const PADDING_TOP = 45;
export const PADDING_BOTTOM = 74;
export const PADDING_DESKTOP = 3;

// Week — corner radius of a normal (small) week per mode & screen size.
export const BORDER_RADIUS_MAP = {
  [ELifeMode.Years]: { small: 2, large: 3 },
  [ELifeMode.Seasons]: { small: 6, large: 10 },
  [ELifeMode.Months]: { small: 14, large: 22 },
};

// Corner radius of the big (preview) week. It's a separate, larger value than the
// small week — and the small↔big gap differs per mode, so tune months/seasons here.
export const BIG_BORDER_RADIUS_MAP = {
  [ELifeMode.Seasons]: { small: 24, large: 32 },
  [ELifeMode.Months]: { small: 24, large: 32 },
};

export const BORDER_WIDTH_MAP = {
  [ELifeMode.Years]: { small: 1, large: 1 },
  [ELifeMode.Seasons]: { small: 1, large: 2 },
  [ELifeMode.Months]: { small: 2, large: 3 },
};

export const LARGE_MONTH_WEEK_SIZE_MULTIPLIER = 1.3; // Size multiplier for large weeks

export const WEEK_IN_MONTH_GAP = 6; // Gap between weeks in the same month row

// Vertical gap between month rows. Single source of truth: rest render and the
// morph frame builder must share it, otherwise years→months snaps at settle.
export const MONTHS_ROW_GAP = 120;
