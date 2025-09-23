import { Container } from 'pixi.js';

import { EMonthsWeekIndxsValues, EWeekType, THolidayName } from '@/types';

import { renderWeek } from './renderWeek';
import { CONTAINER_LABELS, PADDING_DESKTOP, PADDING_TOP } from '../constants/draw';
import { TLifeGridState } from '../types';

// Constants for months mode
const ROW_GAP = 40; // Gap between month rows (reduced from 30)
const WEEK_GAP = 8; // Gap between weeks in the same row (increased from 12)
const WEEKS_PER_ROW = 5; // Maximum weeks per row
const LARGE_WEEK_SIZE_MULTIPLIER = 1.5; // Size multiplier for large weeks
const MONTHS_MODE_WEEK_COUNT = 50; // Number of weeks to show in months mode

export const renderMonthList = (state: TLifeGridState) => {
  const { app, drawWeekIndexes, theme, isScreenMedium, lifeMode, today, container } = state;

  if (!app) return;

  const { lastWeekIndex, monthsIndxs } = drawWeekIndexes;

  const weekContainer = app.stage.getChildByLabel(CONTAINER_LABELS.weeks) as Container;
  if (!weekContainer) return;

  const width = container?.clientWidth || app.renderer.width;

  // Padding for header and navbar in months mode
  const paddingTop = isScreenMedium ? PADDING_TOP + ROW_GAP : PADDING_DESKTOP;

  // Calculate week dimensions for months mode
  const weekWidth = (width - (WEEKS_PER_ROW + 1) * WEEK_GAP) / WEEKS_PER_ROW;
  const weekHeight = weekWidth; // Square weeks
  const largeWeekHeight = weekHeight * LARGE_WEEK_SIZE_MULTIPLIER;

  // Hide weeks beyond the first 100 by moving them off-screen
  const hideOffsetY = 10000; // Move off-screen

  // Hide all existing weeks first
  for (let i = 0; i < lastWeekIndex; i++) {
    const weekChild = weekContainer.children[i];
    if (weekChild) {
      weekChild.y = hideOffsetY;
      weekChild.visible = false;
    }
  }

  // Render weeks with months mode styling
  let currentRow = 0;
  let currentCol = 0;
  // let weeksInCurrentRow = 0;
  let weeksPerRow = 5; // Default for First5/FirstFull5

  const baseProps = {
    theme,
    cellWidth: weekWidth,
    cellHeight: weekHeight,
    isScreenMedium,
    stage: weekContainer,
    lifeMode,
    weekType: EWeekType.Future,
    holiday: null as THolidayName | null,
    half: false,
  };

  for (let i = 0; i < Math.min(MONTHS_MODE_WEEK_COUNT, lastWeekIndex); i++) {
    const monthFlag = monthsIndxs[i];
    const holiday = drawWeekIndexes.holidaysIndxs[i];
    const weekType =
      i > today.todayWeekIndex
        ? EWeekType.Future
        : i === today.todayWeekIndex
          ? EWeekType.Present
          : EWeekType.Past;

    baseProps.holiday = holiday;
    baseProps.weekType = weekType;

    // Determine week position and size based on flag
    let cellHeight = weekHeight;
    const cellWidth = weekWidth;

    // Check if this is a first week (starts new row) or first week of all
    if (
      i === 0 ||
      monthFlag === EMonthsWeekIndxsValues.FirstFull5 ||
      monthFlag === EMonthsWeekIndxsValues.FirstFull4 ||
      monthFlag === EMonthsWeekIndxsValues.First5 ||
      monthFlag === EMonthsWeekIndxsValues.First4
    ) {
      // Start new row
      currentRow++;
      currentCol = 0;
      // weeksInCurrentRow = 1;

      // Determine weeks per row based on flag
      if (
        monthFlag === EMonthsWeekIndxsValues.FirstFull4 ||
        monthFlag === EMonthsWeekIndxsValues.First4
      ) {
        weeksPerRow = 4;
      } else {
        weeksPerRow = 5;
      }

      // Check if this is a large week
      // if (
      //   monthFlag === EMonthsWeekIndxsValues.FirstFull5 ||
      //   monthFlag === EMonthsWeekIndxsValues.FirstFull4
      // ) {
      //   cellHeight = largeWeekHeight;
      // }
    } else {
      // Continue current row
      currentCol++;
      // weeksInCurrentRow++;
    }

    // Calculate position with centering for 4-week rows
    let x: number;
    if (weeksPerRow === 4) {
      // Center 4-week rows
      const rowWidth = 4 * weekWidth + 3 * WEEK_GAP;
      const startX = (width - rowWidth) / 2;
      x = startX + currentCol * (weekWidth + WEEK_GAP);
    } else {
      // Full width for 5-week rows - stretch to edges
      const rowWidth = 5 * weekWidth + 4 * WEEK_GAP;
      const startX = (width - rowWidth) / 2;
      x = startX + currentCol * (weekWidth + WEEK_GAP);
    }

    const y = paddingTop + (currentRow - 1) * (weekHeight + ROW_GAP);

    // Render the week
    renderWeek({
      ...baseProps,
      x,
      y,
      cellWidth,
      cellHeight,
    });
  }
};
