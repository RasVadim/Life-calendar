import {
  GRID_GAP,
  PADDING_BOTTOM,
  PADDING_DESKTOP,
  PADDING_TOP,
  QUADRATIC_WEEK_ROWS_LEVEL,
} from '../constants';
import { TLifeGridState } from '../types';

// Fixed number of week cells per row in years mode (52 weeks + 1 half)
const YEARS_COLS = 53;

export type TYearsLayout = {
  screenSize: 'small' | 'large';
  cols: number;
  rows: number;
  gridGap: number;
  cellWidth: number;
  cellHeight: number;
  actualGap: number;
  paddingTop: number;
  /** Absolute pixel position of a cell at the given row/col. */
  positionAt: (row: number, col: number) => { x: number; y: number };
};

/**
 * Single source of truth for years-mode grid geometry.
 * Shared by the initial render and the resize updater to keep them in sync.
 */
export const computeYearsLayout = (state: TLifeGridState): TYearsLayout => {
  const { app, container, isScreenMedium, drawWeekIndexes } = state;
  const { yearRows } = drawWeekIndexes;

  const width = container?.clientWidth || app?.renderer.width || 0;
  const height = container?.clientHeight || app?.renderer.height || 0;
  const screenSize = isScreenMedium ? 'small' : 'large';

  const cols = YEARS_COLS;
  const isMoreThanQuadratic = yearRows > QUADRATIC_WEEK_ROWS_LEVEL;
  const rows = isMoreThanQuadratic ? yearRows : QUADRATIC_WEEK_ROWS_LEVEL;
  const gridGap = GRID_GAP[screenSize];

  const paddingTop = isScreenMedium ? PADDING_TOP : PADDING_DESKTOP;
  const paddingBottom = isScreenMedium ? PADDING_BOTTOM : PADDING_DESKTOP;

  const availableHeight = height - paddingTop - paddingBottom;

  const cellHeight = (availableHeight - gridGap * (rows + 1)) / rows;
  const cellWidth = (width - gridGap * (cols + 1)) / cols;
  const actualGap = isMoreThanQuadratic
    ? gridGap
    : (availableHeight - cellHeight * rows) / (rows + 1);

  const positionAt = (row: number, col: number) => ({
    x: col * (cellWidth + gridGap) + gridGap,
    y: paddingTop + row * (cellHeight + actualGap) + actualGap,
  });

  return {
    screenSize,
    cols,
    rows,
    gridGap,
    cellWidth,
    cellHeight,
    actualGap,
    paddingTop,
    positionAt,
  };
};
