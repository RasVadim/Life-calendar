import { Container } from 'pixi.js';

import {
  ELifeMode,
  EMonthsWeekIndxsValues,
  EMonthsEndsIndxsValues,
  EWeekType,
  THolidayName,
  TMonthsIndxsValue,
} from '@/types';

import { renderWeek } from './renderWeek';
import {
  BIG_BORDER_RADIUS_MAP,
  CONTAINER_LABELS,
  LARGE_MONTH_WEEK_SIZE_MULTIPLIER,
  MONTHS_ROW_GAP,
  PADDING_DESKTOP,
  PADDING_TOP,
  WEEK_IN_MONTH_GAP,
} from '../constants';
import { TLifeGridState } from '../types';
import { renderLabel } from './renderLabel';
import { renderRowThreadLine } from './renderRowThreadLine';
import { renderThreadLineEnd } from './renderThreadLineEnd';
import { renderThreadLineStart } from './renderThreadLineStart';
import { calculateMonthWeekXPosition, getMonthDynamicWeekWidth } from './utils';
import { getCachedColor, getWeekType } from '../utils';

// Constants for months mode
const ROW_GAP = MONTHS_ROW_GAP; // Gap between month rows (shared with morph frames)

const THREAD_MARGIN_TOP = 36; // Scaled with ROW_GAP to sit in the row gap

// Extreme (end-cap) types are drawn by a dedicated renderer, not the row one.
const END_TYPES = new Set<string>(Object.values(EMonthsEndsIndxsValues));

export const renderMonthList = (state: TLifeGridState) => {
  const { app, drawWeekIndexes, theme, isScreenMedium, lifeMode, today, container, media } = state;
  if (!app) return;

  const renderer = app.renderer;
  const { lastWeekIndex, monthsIndxs } = drawWeekIndexes;

  const weekContainer = app.stage.getChildByLabel(CONTAINER_LABELS.weeks) as Container;
  if (!weekContainer) return;

  const width = container?.clientWidth || app.renderer.width;

  // Padding for header and navbar in months mode
  const paddingTop = isScreenMedium ? PADDING_TOP + ROW_GAP : PADDING_DESKTOP;

  // Calculate ONE fixed week size based on full 5-week row (with side margins)
  // This size will be used for ALL normal weeks regardless of row configuration
  const weekWidth = getMonthDynamicWeekWidth(5, width, WEEK_IN_MONTH_GAP);
  const weekHeight = weekWidth; // Square weeks
  const largeWeekWidth = weekWidth * LARGE_MONTH_WEEK_SIZE_MULTIPLIER;
  const largeWeekHeight = largeWeekWidth;

  // Hide weeks beyond the first 100 by moving them off-screen
  const hideOffsetY = 10000; // Move off-screen

  // Hide all existing weeks first (inclusive of the death week at lastWeekIndex)
  for (let i = 0; i <= lastWeekIndex; i++) {
    const weekChild = weekContainer.children[i];
    if (weekChild) {
      weekChild.y = hideOffsetY;
      weekChild.visible = false;
    }
  }

  // Identity of the last month (the row that ends life). Its own start marker is
  // suppressed so the end-cap renderer owns the whole thread, exactly like the
  // first month is fully owned by renderThreadLineStart.
  const deathMonth = monthsIndxs[lastWeekIndex]?.month;
  const deathYear = monthsIndxs[lastWeekIndex]?.year;

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
  let currentRowMonth = ''; // Month/year of the row currently being filled
  let currentRowYear = '';

  // Inclusive of lastWeekIndex: the death week is drawn as the final square.
  for (let i = 0; i <= lastWeekIndex; i++) {
    const monthData: TMonthsIndxsValue = monthsIndxs[i];
    const monthFlag = monthData?.type;
    const holiday = drawWeekIndexes.holidaysIndxs[i];

    baseProps.holiday = holiday;
    baseProps.weekType = getWeekType(i, today.todayWeekIndex);

    // Check if this week is a month preview week (has media in monthData)
    const isMonthPreview = monthData?.media && media[monthData.media]?.isMonthPreview === true;

    // Week dimensions will be calculated dynamically below
    let cellHeight: number;
    let cellWidth: number;

    // The death week carries an end-cap type (not First*). It still must open a
    // new row when it begins a fresh month, otherwise it overflows the last row.
    const isDeathWeek = i === lastWeekIndex;
    const deathWeekOpensMonth =
      isDeathWeek &&
      !!monthData?.month &&
      (monthData.month !== currentRowMonth || monthData.year !== currentRowYear);

    // Stale-data safety: the death week only became drawable once data-prep began
    // tagging it. If the persisted indexes predate that (no month flag), skip it
    // instead of overflowing the previous row until the grid is regenerated.
    if (isDeathWeek && !monthData?.month) continue;

    // Check if this is a first week (starts new row) or first week of all
    if (
      i === 0 ||
      deathWeekOpensMonth ||
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
        currentRowMonth = monthData.month;
        currentRowYear = monthData.year;

        const rowY = paddingTop + (currentRow - 1) * (weekHeight + ROW_GAP);

        renderLabel({
          container: weekContainer,
          month: monthData.month,
          year: monthData.year,
          x: WEEK_IN_MONTH_GAP,
          y: rowY,
          theme,
        });
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
      weekGap: WEEK_IN_MONTH_GAP,
      containerWidth: width,
      accumulatedOffsetX,
      weeksPerRow,
      fixedWeekWidth: weekWidth,
      largeWeekWidth,
      monthOffset: drawWeekIndexes.monthOffset,
      isFirstRow: currentRow === 1,
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

    // Render the week. The big (preview) week gets its own larger corner radius,
    // independent of the small-week value (small↔big gap tuned per mode).
    renderWeek({
      ...baseProps,
      x,
      y,
      cellWidth,
      cellHeight,
      ...(isMonthPreview
        ? { borderRadius: BIG_BORDER_RADIUS_MAP[ELifeMode.Months][isScreenMedium ? 'small' : 'large'] }
        : {}),
    });

    // First / last week carry EMonthsEndsIndxsValues (start / end caps).
    const isFirstWeekOfLife = i === 0;
    const isLastWeekOfLife = isDeathWeek && i !== 0;

    // The last month's own start marker is suppressed: the end-cap renderer draws
    // the whole incoming thread (mirror of the first month), so they never collide.
    const isLastMonthStart =
      !isLastWeekOfLife &&
      !!monthData?.month &&
      monthData.month === deathMonth &&
      monthData.year === deathYear;

    // Render thread line for the last week of the row OR first week with special type
    const shouldRenderThreadLine = !!monthFlag && !isLastMonthStart;

    if (shouldRenderThreadLine) {
      // Calculate thread line position and colors
      const threadY = baseY + weekHeight + THREAD_MARGIN_TOP;
      const monthNumber = parseInt(monthData?.month || '1', 10);
      const isEvenMonth = monthNumber % 2 === 0;

      const currentThreadColor = isEvenMonth ? theme.primary2 : theme.primary;
      const nextThreadColor = isEvenMonth ? theme.primary : theme.primary2;

      const currentColorNumber = getCachedColor(currentThreadColor).toNumber();
      const nextColorNumber = getCachedColor(nextThreadColor).toNumber();

      // Thread start X: left edge, or offset past the first-row month indent.
      const getStartX = () => {
        if (currentRow !== 1) return 0;

        if (isMonthPreview) {
          return (
            (drawWeekIndexes.monthOffset + 1) * weekWidth +
            (drawWeekIndexes.monthOffset + 1) * WEEK_IN_MONTH_GAP
          );
        } else {
          return (
            drawWeekIndexes.monthOffset * weekWidth +
            largeWeekWidth +
            (drawWeekIndexes.monthOffset + 1) * WEEK_IN_MONTH_GAP
          );
        }
      };

      if (isFirstWeekOfLife) {
        renderThreadLineStart({
          container: weekContainer,
          weekX: x,
          threadY,
          currentColor: currentThreadColor,
          nextColor: nextThreadColor,
          containerWidth: width,
          weekType: monthData.type as EMonthsEndsIndxsValues,
          weekWidth,
          largeWeekWidth,
          isPreview: !!isMonthPreview,
          renderer,
          currentColorNumber,
          nextColorNumber,
        });
      } else if (isLastWeekOfLife && END_TYPES.has(monthData.type)) {
        // End-of-life cap on the last drawn week (mirrors the first week).
        renderThreadLineEnd({
          container: weekContainer,
          startX: getStartX(),
          weekX: x,
          threadY,
          containerWidth: width,
          weekType: monthData.type as EMonthsEndsIndxsValues,
          weekWidth,
          largeWeekWidth,
          isPreview: !!isMonthPreview,
          renderer,
          currentColorNumber,
          nextColorNumber,
        });
      } else {
        // Render thread from left edge to middle of last week
        renderRowThreadLine({
          container: weekContainer,
          startX: getStartX(),
          weekX: x,
          threadY,
          containerWidth: width,
          weekType: monthData.type as EMonthsWeekIndxsValues,
          weekWidth,
          largeWeekWidth,
          isPreview: !!isMonthPreview,
          renderer,
          currentColorNumber,
          nextColorNumber,
          isFirstRow: currentRow === 1,
        });
      }
    }
  }
};
