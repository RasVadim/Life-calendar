import { Container } from 'pixi.js';

import { EMonthsWeekIndxsValues, EWeekType, THolidayName } from '@/types';

import { renderWeek } from './renderWeek';
import {
  CONTAINER_LABELS,
  LARGE_MONTH_WEEK_SIZE_MULTIPLIER,
  PADDING_DESKTOP,
  PADDING_TOP,
} from '../constants/draw';
import { TLifeGridState } from '../types';
import { calculateMonthWeekXPosition, getMonthDynamicWeekWidth } from './utils';

// Constants for months mode
const ROW_GAP = 80; // Gap between month rows (reduced from 30)
const WEEK_GAP = 8; // Gap between weeks in the same row (increased from 12)
const MONTHS_MODE_WEEK_COUNT = 50; // Number of weeks to show in months mode

export const renderMonthList = (state: TLifeGridState) => {
  const { app, drawWeekIndexes, theme, isScreenMedium, lifeMode, today, container, media } = state;

  if (!app) return;

  const { lastWeekIndex, monthsIndxs } = drawWeekIndexes;

  const weekContainer = app.stage.getChildByLabel(CONTAINER_LABELS.weeks) as Container;
  if (!weekContainer) return;

  const width = container?.clientWidth || app.renderer.width;

  // Padding for header and navbar in months mode
  const paddingTop = isScreenMedium ? PADDING_TOP + ROW_GAP : PADDING_DESKTOP;

  // Calculate ONE fixed week size based on full 5-week row (with side margins)
  // This size will be used for ALL normal weeks regardless of row configuration
  const weekWidth = getMonthDynamicWeekWidth(5, width, WEEK_GAP);
  const weekHeight = weekWidth; // Square weeks
  const largeWeekWidth = weekWidth * LARGE_MONTH_WEEK_SIZE_MULTIPLIER;
  const largeWeekHeight = largeWeekWidth;

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

  // Track current row state
  let accumulatedOffsetX = 0; // Accumulated offset from large weeks in current row

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

    // Check if this week is a month preview week
    const mediaKey = drawWeekIndexes.mediaIndxs[i];
    const weekMedia = mediaKey ? media[mediaKey] : null;
    const isMonthPreview = weekMedia?.isMonthPreview === true;

    // Week dimensions will be calculated dynamically below
    let cellHeight: number;
    let cellWidth: number;

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
      accumulatedOffsetX = 0;

      // Determine weeks per row based on flag
      if (
        monthFlag === EMonthsWeekIndxsValues.FirstFull4 ||
        monthFlag === EMonthsWeekIndxsValues.First4
      ) {
        weeksPerRow = 4;
      } else {
        weeksPerRow = 5;
      }

      // No pre-scanning needed - dynamic centering will handle it
    } else {
      // Continue current row
      currentCol++;
    }

    // Use fixed sizes - all normal weeks same size, all large weeks same size
    if (isMonthPreview) {
      cellWidth = largeWeekWidth;
      cellHeight = largeWeekHeight;
    } else {
      cellWidth = weekWidth;
      cellHeight = weekHeight;
    }

    // Calculate position using flex-like behavior
    const x = calculateMonthWeekXPosition({
      currentCol,
      weekGap: WEEK_GAP,
      containerWidth: width,
      accumulatedOffsetX,
      weeksPerRow,
    });

    // Update accumulated offset for next weeks in the same row
    if (isMonthPreview) {
      accumulatedOffsetX += largeWeekWidth - weekWidth;
    }

    // Calculate Y position with vertical centering for large weeks
    const baseY = paddingTop + (currentRow - 1) * (weekHeight + ROW_GAP);

    // Center large weeks vertically: offset by half the height difference
    const verticalCenteringOffset = isMonthPreview ? -(cellHeight - weekHeight) / 2 : 0;

    const y = baseY + verticalCenteringOffset;

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
