import { Container, Graphics } from 'pixi.js';

import { ELifeMode } from '@/types';

import {
  BORDER_WIDTH_MAP,
  GRID_GAP,
  PADDING_BOTTOM,
  PADDING_DESKTOP,
  PADDING_TOP,
  QUADRATIC_WEEK_ROWS_LEVEL,
} from '../constants';
import { TLifeGridState } from '../types';

export const resizeGrid = ({ app, drawWeekIndexes, isScreenMedium }: TLifeGridState) => {
  if (!app?.stage) return;

  const { yearRows } = drawWeekIndexes;

  const width = app.renderer.width;
  const height = app.renderer.height;
  const screenSize = isScreenMedium ? 'small' : 'large';

  // Fixed number of elements per row (53)
  const cols = 53;
  const isMoreThanQuadratic = yearRows > QUADRATIC_WEEK_ROWS_LEVEL;
  const rows = isMoreThanQuadratic ? yearRows : QUADRATIC_WEEK_ROWS_LEVEL;
  const gridGap = GRID_GAP[screenSize];

  // Padding for header and navbar in years mode
  const paddingTop = isScreenMedium ? PADDING_TOP : PADDING_DESKTOP;
  const paddingBottom = isScreenMedium ? PADDING_BOTTOM : PADDING_DESKTOP;

  const availableHeight = height - paddingTop - paddingBottom;

  const weekBorderWidth = BORDER_WIDTH_MAP[ELifeMode.Years][screenSize];

  const cellHeight = (availableHeight - gridGap * (rows + 1)) / rows + weekBorderWidth;
  const cellWidth = (width - gridGap * (cols + 1)) / cols + weekBorderWidth;
  const actualGap = isMoreThanQuadratic
    ? gridGap
    : (availableHeight - (cellHeight - weekBorderWidth) * rows) / (rows + 1);

  let currentRow = 0;
  let currentCol = 0;
  let previousX = 0;

  const getPosition = () => ({
    x: currentCol * (cellWidth - weekBorderWidth + gridGap) + gridGap,
    y: paddingTop + currentRow * (cellHeight - weekBorderWidth + actualGap) + actualGap,
  });

  const weeks = app.stage.children;

  for (let i = 0; i < weeks.length - 1; i++) {
    const weekEl = weeks[i];

    const changeWeek = (week: Container | Graphics) => {
      previousX = week.position.x;
      week.setSize(cellWidth, cellHeight);

      const position = getPosition();
      week.position.set(position.x, position.y);
    };

    if (i === 0) {
      currentRow = 0;
      currentCol = 0;
      changeWeek(weekEl);
      continue;
    }

    const isContainer = weekEl.allowChildren;

    if (isContainer) {
      currentCol++;
      changeWeek(weekEl.children[0]);

      currentRow++;
      currentCol = 0;
      changeWeek(weekEl.children[1]);
      continue;
    }

    if (previousX > weekEl.position.x) {
      currentRow++;
      currentCol = 0;
      changeWeek(weekEl);
      continue;
    }

    currentCol++;
    changeWeek(weekEl);
  }
};
