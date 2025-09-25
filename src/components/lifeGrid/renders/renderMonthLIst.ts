import i18n from 'i18next';
import { Container, Graphics, Text } from 'pixi.js';

import { EMonthsWeekIndxsValues, EWeekType, THolidayName, TMonthsIndxsValue } from '@/types';

import { renderWeek } from './renderWeek';
import {
  CONTAINER_LABELS,
  LARGE_MONTH_WEEK_SIZE_MULTIPLIER,
  PADDING_DESKTOP,
  PADDING_TOP,
} from '../constants/draw';
import { TLifeGridState } from '../types';
import { calculateMonthWeekXPosition, getMonthDynamicWeekWidth } from './utils';
import { getCachedColor } from '../utils';

// Constants for months mode
const ROW_GAP = 80; // Gap between month rows (reduced from 30)
const WEEK_GAP = 8; // Gap between weeks in the same row (increased from 12)
const MONTHS_MODE_WEEK_COUNT = 50; // Number of weeks to show in months mode

// Constants for month labels
const LABEL_FONT_SIZE = 13;
const LABEL_MARGIN_BOTTOM = 20;
const LABEL_GAP = 8;
const LABEL_LEFT_MARGIN = 26;

// Constants for thread lines
const THREAD_HEIGHT = 1;
const THREAD_MARGIN_TOP = 20; // Increased margin to position threads lower
const THREAD_CIRCLE_RADIUS = 2;
const THREAD_CIRCLE_GAP = 4; // Gap between two circles

/**
 * Render month and year label for a row
 */
const renderMonthLabel = (
  container: Container,
  month: string,
  year: string,
  x: number,
  y: number,
  theme: Record<string, string>,
) => {
  const monthName = i18n.t(`life.${month}`);

  // Get month color based on alternating pattern starting from January
  const monthNumber = parseInt(month, 10);
  const isEvenMonth = monthNumber % 2 === 0;
  const monthColor = isEvenMonth ? theme.primary2 : theme.primary;

  // Create month text with alternating color
  const monthText = new Text({
    text: monthName,
    style: {
      fontFamily: 'Montserrat, sans-serif',
      fontSize: LABEL_FONT_SIZE,
      fill: getCachedColor(monthColor).toNumber(),
      fontWeight: '300',
    },
  });

  // Create year text with text color
  const yearText = new Text({
    text: year,
    style: {
      fontFamily: 'Montserrat, sans-serif',
      fontSize: LABEL_FONT_SIZE,
      fill: getCachedColor(theme.text).toNumber(),
      fontWeight: '300',
    },
  });

  // Position texts
  yearText.x = x + LABEL_LEFT_MARGIN;
  yearText.y = y - LABEL_MARGIN_BOTTOM - LABEL_FONT_SIZE;

  monthText.x = yearText.x + yearText.width + LABEL_GAP; // 8px gap between year and month
  monthText.y = y - LABEL_MARGIN_BOTTOM - LABEL_FONT_SIZE;

  container.addChild(yearText);
  container.addChild(monthText);
};

/**
 * Render thread line under a row of weeks with two hollow circles at the end
 */
const renderRowThreadLine = (
  container: Container,
  startX: number,
  endX: number,
  y: number,
  currentColor: string,
  nextColor: string,
  containerWidth: number,
) => {
  const currentColorNumber = getCachedColor(currentColor).toNumber();
  const nextColorNumber = getCachedColor(nextColor).toNumber();

  // Draw the line (shortened by circle radius to avoid overlap)
  const lineEndX = endX - THREAD_CIRCLE_RADIUS;
  const thread = new Graphics();
  thread.rect(startX, y, lineEndX - startX, THREAD_HEIGHT).fill(currentColorNumber);
  container.addChild(thread);

  // Draw the first hollow circle (current month color)
  const circle1 = new Graphics();
  circle1
    .circle(endX, y + THREAD_HEIGHT / 2, THREAD_CIRCLE_RADIUS)
    .stroke({ color: currentColorNumber, width: THREAD_HEIGHT });
  container.addChild(circle1);

  // Draw the second hollow circle (next month color)
  const circle2X = endX + THREAD_CIRCLE_RADIUS * 2 + THREAD_CIRCLE_GAP;
  const circle2 = new Graphics();
  circle2
    .circle(circle2X, y + THREAD_HEIGHT / 2, THREAD_CIRCLE_RADIUS)
    .stroke({ color: nextColorNumber, width: THREAD_HEIGHT });
  container.addChild(circle2);

  // Draw the second thread line from second circle to right edge of screen
  const secondLineStartX = circle2X + THREAD_CIRCLE_RADIUS;
  const secondThread = new Graphics();
  secondThread
    .rect(secondLineStartX, y, containerWidth - secondLineStartX, THREAD_HEIGHT)
    .fill(nextColorNumber);
  container.addChild(secondThread);
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
    const monthData: TMonthsIndxsValue = monthsIndxs[i];
    const monthFlag = monthData?.type;
    const holiday = drawWeekIndexes.holidaysIndxs[i];
    const weekType =
      i > today.todayWeekIndex
        ? EWeekType.Future
        : i === today.todayWeekIndex
          ? EWeekType.Present
          : EWeekType.Past;

    baseProps.holiday = holiday;
    baseProps.weekType = weekType;

    // Check if this week is a month preview week (has media in monthData)
    const isMonthPreview = monthData?.media && media[monthData.media]?.isMonthPreview === true;

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

      // Render month/year label for new row
      if (monthData?.month && monthData?.year) {
        const rowY = paddingTop + (currentRow - 1) * (weekHeight + ROW_GAP);

        renderMonthLabel(
          weekContainer,
          monthData.month,
          monthData.year,
          WEEK_GAP, // Left margin for label
          rowY,
          theme,
        );
      }
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
      fixedWeekWidth: weekWidth,
      largeWeekWidth,
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

    // Render thread line for the first week of the row
    if (currentCol === 0) {
      // Calculate thread line position and colors
      const threadY = baseY + weekHeight + THREAD_MARGIN_TOP;
      const monthNumber = parseInt(monthData?.month || '1', 10);
      const isEvenMonth = monthNumber % 2 === 0;
      const currentThreadColor = isEvenMonth ? theme.primary2 : theme.primary;

      // Calculate next month color (opposite of current)
      const nextThreadColor = isEvenMonth ? theme.primary : theme.primary2;

      // Calculate total accumulated offset for all weeks in the row
      // We need to simulate the accumulated offset that will be at the last week
      let totalAccumulatedOffset = 0;
      if (isMonthPreview) {
        totalAccumulatedOffset += largeWeekWidth - weekWidth; // First week offset
      }

      // Calculate position of the middle of the last week in the row
      const lastWeekCol = weeksPerRow - 1;
      const lastWeekX = calculateMonthWeekXPosition({
        currentCol: lastWeekCol,
        weekGap: WEEK_GAP,
        containerWidth: width,
        accumulatedOffsetX: totalAccumulatedOffset,
        weeksPerRow,
        fixedWeekWidth: weekWidth,
        largeWeekWidth,
      });
      const lastWeekCenterX = lastWeekX + weekWidth / 2;

      // Render thread from left edge to middle of last week
      renderRowThreadLine(
        weekContainer,
        0, // Start from left edge of screen
        lastWeekCenterX,
        threadY,
        currentThreadColor,
        nextThreadColor,
        width,
      );
    }
  }
};
