import { Container, Graphics } from 'pixi.js';

import { DEVICE_SCREEN_WIDTH } from '@/constants';
import { ELifeMode } from '@/types';

import { BORDER_WIDTH_MAP, CONTAINER_LABELS } from '../constants';
import { computeYearsLayout } from '../layouts';
import { TLifeGridState } from '../types';

export const resizeYearsList = (state: TLifeGridState) => {
  const { app } = state;

  if (!app?.stage) return;

  state.isScreenMedium = window.innerWidth < DEVICE_SCREEN_WIDTH.medium;

  const { screenSize, cellWidth, cellHeight, positionAt } = computeYearsLayout(state);
  const weekBorderWidth = BORDER_WIDTH_MAP[ELifeMode.Years][screenSize];

  let currentRow = 0;
  let currentCol = 0;
  let previousX = 0;

  const weeks = app.stage.getChildByLabel(CONTAINER_LABELS.weeks)?.children || [];

  for (let i = 0; i < weeks.length; i++) {
    const weekEl = weeks[i];

    const changeWeek = (week: Container | Graphics) => {
      previousX = week.position.x;
      // width and height of week should be with week Border Width
      week.setSize(cellWidth + weekBorderWidth, cellHeight + weekBorderWidth);
      const { x, y } = positionAt(currentRow, currentCol);
      week.position.set(x, y);
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
