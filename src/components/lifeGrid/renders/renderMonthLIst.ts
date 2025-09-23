import { Container } from 'pixi.js';

import { EMonthsWeekIndxsValues, EWeekType, THolidayName } from '@/types';

import { renderWeek } from './renderWeek';
import { CONTAINER_LABELS, PADDING_DESKTOP, PADDING_TOP } from '../constants/draw';
import { TLifeGridState } from '../types';

// Constants for months mode
const ROW_GAP = 80; // Gap between month rows (reduced from 30)
const WEEK_GAP = 8; // Gap between weeks in the same row (increased from 12)
const LARGE_WEEK_SIZE_MULTIPLIER = 1.5; // Size multiplier for large weeks
const MONTHS_MODE_WEEK_COUNT = 50; // Number of weeks to show in months mode

// Calculate total width of a row including large weeks
const calculateRowWidth = (
  startIndex: number,
  weeksPerRow: number,
  weekWidth: number,
  weekGap: number,
  drawWeekIndexes: TLifeGridState['drawWeekIndexes'],
  media: TLifeGridState['media'],
): number => {
  let totalWidth = 0;
  const gaps = (weeksPerRow - 1) * weekGap;

  for (let j = 0; j < weeksPerRow; j++) {
    const weekIndex = startIndex + j;
    if (weekIndex >= MONTHS_MODE_WEEK_COUNT) break;

    const mediaKey = drawWeekIndexes.mediaIndxs[weekIndex];
    const weekMedia = mediaKey ? media[mediaKey] : null;
    const isLarge = weekMedia?.isMonthPreview === true;

    totalWidth += isLarge ? weekWidth * LARGE_WEEK_SIZE_MULTIPLIER : weekWidth;
  }

  return totalWidth + gaps;
};

// Calculate X position with proper centering
interface CalculateWeekXPositionWithCenteringParams {
  currentCol: number;
  weekWidth: number;
  weekGap: number;
  containerWidth: number;
  accumulatedOffsetX: number;
  totalRowWidth: number;
}

const calculateWeekXPositionWithCentering = ({
  currentCol,
  weekWidth,
  weekGap,
  containerWidth,
  accumulatedOffsetX,
  totalRowWidth,
}: CalculateWeekXPositionWithCenteringParams): number => {
  // Center the row based on its actual width
  const rowStartX = (containerWidth - totalRowWidth) / 2;

  // Calculate base position for current column
  const baseX = rowStartX + currentCol * (weekWidth + weekGap);

  // Add accumulated offset from large weeks that came before this position
  return baseX + accumulatedOffsetX;
};

export const renderMonthList = (state: TLifeGridState) => {
  const { app, drawWeekIndexes, theme, isScreenMedium, lifeMode, today, container, media } = state;

  if (!app) return;

  const { lastWeekIndex, monthsIndxs } = drawWeekIndexes;

  const weekContainer = app.stage.getChildByLabel(CONTAINER_LABELS.weeks) as Container;
  if (!weekContainer) return;

  const width = container?.clientWidth || app.renderer.width;

  // Padding for header and navbar in months mode
  const paddingTop = isScreenMedium ? PADDING_TOP + ROW_GAP : PADDING_DESKTOP;

  // Calculate week dimensions for months mode
  // For 5-week row with one large week: 4 normal + 1 large (1.5x) + 4 gaps
  // Total width = 4 * weekWidth + 1.5 * weekWidth + 4 * WEEK_GAP = 5.5 * weekWidth + 4 * WEEK_GAP
  // Solve: width = 5.5 * weekWidth + 4 * WEEK_GAP + 2 * WEEK_GAP (side margins)
  const totalGapsFor5Weeks = 6 * WEEK_GAP; // 4 gaps between weeks + 2 side margins
  const totalWeekWidthMultiplier = 5.5; // 4 normal + 1.5 large
  const weekWidth = (width - totalGapsFor5Weeks) / totalWeekWidthMultiplier;
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
  let totalRowWidth = 0; // Actual width of current row including large weeks

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

    // Determine week position and size based on flag
    let cellHeight = weekHeight;
    let cellWidth = weekWidth;

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

      // Calculate total row width including large weeks for proper centering
      totalRowWidth = calculateRowWidth(
        i,
        weeksPerRow,
        weekWidth,
        WEEK_GAP,
        drawWeekIndexes,
        media,
      );
    } else {
      // Continue current row
      currentCol++;
    }

    // Make month preview weeks larger
    if (isMonthPreview) {
      cellHeight = largeWeekHeight;
      cellWidth = cellHeight;
    }

    // Calculate position using proper centering with total row width
    const x = calculateWeekXPositionWithCentering({
      currentCol,
      weekWidth,
      weekGap: WEEK_GAP,
      containerWidth: width,
      accumulatedOffsetX,
      totalRowWidth,
    });

    // Update accumulated offset for next weeks in the same row
    if (isMonthPreview) {
      accumulatedOffsetX += weekWidth * LARGE_WEEK_SIZE_MULTIPLIER - weekWidth;
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
