import { Container, Graphics } from 'pixi.js';

import { DEVICE_SCREEN_WIDTH } from '@/constants';
import { ELifeMode } from '@/types';

import {
  BORDER_WIDTH_MAP,
  CONTAINER_LABELS,
  GRID_GAP,
  PADDING_BOTTOM,
  PADDING_DESKTOP,
  PADDING_TOP,
  QUADRATIC_WEEK_ROWS_LEVEL,
} from '../constants';
import { TLifeGridState } from '../types';

export const resizeYearsList = (state: TLifeGridState) => {
  const { app, container, drawWeekIndexes } = state;

  if (!app?.stage) return;

  state.isScreenMedium = window.innerWidth < DEVICE_SCREEN_WIDTH.medium;
  const { isScreenMedium } = state;

  const { yearRows } = drawWeekIndexes;

  const width = container?.clientWidth || app.renderer.width;
  const height = container?.clientHeight || app.renderer.height;
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

  const cellHeight = (availableHeight - gridGap * (rows + 1)) / rows;
  const cellWidth = (width - gridGap * (cols + 1)) / cols;
  const actualGap = isMoreThanQuadratic
    ? gridGap
    : (availableHeight - cellHeight * rows) / (rows + 1);

  let currentRow = 0;
  let currentCol = 0;
  let previousX = 0;

  const getPosition = () => ({
    x: currentCol * (cellWidth + gridGap) + gridGap,
    y: paddingTop + currentRow * (cellHeight + actualGap) + actualGap,
  });

  const weeks = app.stage.getChildByLabel(CONTAINER_LABELS.weeks)?.children || [];

  for (let i = 0; i < weeks.length; i++) {
    const weekEl = weeks[i];

    const changeWeek = (week: Container | Graphics) => {
      previousX = week.position.x;
      // width and height of week should be with week Border Width
      week.setSize(cellWidth + weekBorderWidth, cellHeight + weekBorderWidth);

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
