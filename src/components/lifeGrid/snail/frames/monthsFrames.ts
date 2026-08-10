import { RectsDataBuffer } from '@snail/geometry/rect';

import { EMonthsWeekIndxsValues, TMonthsIndxsValue } from '@/types';

import {
  LARGE_MONTH_WEEK_SIZE_MULTIPLIER,
  PADDING_DESKTOP,
  PADDING_TOP,
  WEEK_IN_MONTH_GAP,
} from '../../constants';
import { calculateMonthWeekXPosition, getMonthDynamicWeekWidth } from '../../renders/utils';
import { TLifeGridState } from '../../types';

// Mirrors the constants used inside renderMonthList (kept in sync manually).
const ROW_GAP = 72;
const MONTHS_MODE_WEEK_COUNT = 50;

/**
 * One rect per week matching the original months grid geometry. Weeks past the
 * visible window collapse to zero size so the morph fades them out in place.
 */
export const computeMonthsFrames = (state: TLifeGridState): RectsDataBuffer => {
  const { drawWeekIndexes, isScreenMedium, media, container, app } = state;
  const { lastWeekIndex, monthsIndxs, monthOffset } = drawWeekIndexes;

  const width = container?.clientWidth || app?.renderer.width || 0;
  const paddingTop = isScreenMedium ? PADDING_TOP + ROW_GAP : PADDING_DESKTOP;

  const weekWidth = getMonthDynamicWeekWidth(5, width, WEEK_IN_MONTH_GAP);
  const weekHeight = weekWidth;
  const largeWeekWidth = weekWidth * LARGE_MONTH_WEEK_SIZE_MULTIPLIER;

  const buffer = new RectsDataBuffer(lastWeekIndex);

  const put = (index: number, x: number, y: number, w: number, h: number): void => {
    const ref = buffer.getRef(index);
    ref.x = x;
    ref.y = y;
    ref.width = w;
    ref.height = h;
  };

  const visibleCount = Math.min(MONTHS_MODE_WEEK_COUNT, lastWeekIndex);

  let row = 0;
  let col = 0;
  let weeksPerRow = 5;
  let accumulatedOffsetX = 0;

  for (let i = 0; i < visibleCount; i += 1) {
    const monthData: TMonthsIndxsValue = monthsIndxs[i];
    const monthFlag = monthData?.type;

    const isFirst =
      i === 0 ||
      monthFlag === EMonthsWeekIndxsValues.FirstFull5 ||
      monthFlag === EMonthsWeekIndxsValues.FirstFull4 ||
      monthFlag === EMonthsWeekIndxsValues.First5 ||
      monthFlag === EMonthsWeekIndxsValues.First4;

    if (isFirst) {
      row += 1;
      col = 0;
      accumulatedOffsetX = 0;
      weeksPerRow =
        monthFlag === EMonthsWeekIndxsValues.FirstFull4 ||
        monthFlag === EMonthsWeekIndxsValues.First4
          ? 4
          : 5;
    } else {
      col += 1;
    }

    const isMonthPreview = !!(monthData?.media && media[monthData.media]?.isMonthPreview === true);
    const cellWidth = isMonthPreview ? largeWeekWidth : weekWidth;
    const cellHeight = cellWidth;

    const x = calculateMonthWeekXPosition({
      currentCol: col,
      weekGap: WEEK_IN_MONTH_GAP,
      containerWidth: width,
      accumulatedOffsetX,
      weeksPerRow,
      fixedWeekWidth: weekWidth,
      largeWeekWidth,
      monthOffset,
      isFirstRow: row === 1,
    });

    if (isMonthPreview) accumulatedOffsetX += largeWeekWidth - weekWidth;

    const baseY = paddingTop + (row - 1) * (weekHeight + ROW_GAP);
    const y = baseY + (isMonthPreview ? -(cellHeight - weekHeight) / 2 : 0);

    put(i, x, y, cellWidth, cellHeight);
  }

  // Collapse the rest so the morph fades them out (position ignored when zero).
  for (let i = visibleCount; i < lastWeekIndex; i += 1) {
    put(i, 0, 0, 0, 0);
  }

  return buffer;
};
