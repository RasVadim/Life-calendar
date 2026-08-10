import { RectsDataBuffer } from '@snail/geometry/rect';

import { EMonthsWeekIndxsValues, TMonthsIndxsValue } from '@/types';

import {
  LARGE_MONTH_WEEK_SIZE_MULTIPLIER,
  MONTHS_ROW_GAP,
  PADDING_DESKTOP,
  PADDING_TOP,
  WEEK_IN_MONTH_GAP,
} from '../../constants';
import { calculateMonthWeekXPosition, getMonthDynamicWeekWidth } from '../../renders/utils';
import { TLifeGridState } from '../../types';

// Shared with renderMonthList so morph endpoints match the rest render exactly.
const ROW_GAP = MONTHS_ROW_GAP;

/**
 * One rect per week matching the original months grid geometry, laid out for
 * ALL weeks (rows continue down the whole life). This lets every square morph
 * directly into its month slot instead of collapsing when it leaves the
 * original 50-week window.
 */
export const computeMonthsFrames = (state: TLifeGridState): RectsDataBuffer => {
  const { drawWeekIndexes, isScreenMedium, media, container, app } = state;
  const { lastWeekIndex, monthsIndxs, monthOffset } = drawWeekIndexes;

  const width = container?.clientWidth || app?.renderer.width || 0;
  const paddingTop = isScreenMedium ? PADDING_TOP + ROW_GAP : PADDING_DESKTOP;

  const weekWidth = getMonthDynamicWeekWidth(5, width, WEEK_IN_MONTH_GAP);
  const weekHeight = weekWidth;
  const largeWeekWidth = weekWidth * LARGE_MONTH_WEEK_SIZE_MULTIPLIER;

  const buffer = new RectsDataBuffer(lastWeekIndex + 1);

  const put = (index: number, x: number, y: number, w: number, h: number): void => {
    const ref = buffer.getRef(index);
    ref.x = x;
    ref.y = y;
    ref.width = w;
    ref.height = h;
  };

  let row = 0;
  let col = 0;
  let weeksPerRow = 5;
  let accumulatedOffsetX = 0;
  let currentRowMonth = '';
  let currentRowYear = '';

  // Inclusive of the death week (see renderMonthList) so it morphs into place.
  for (let i = 0; i <= lastWeekIndex; i += 1) {
    const monthData: TMonthsIndxsValue = monthsIndxs[i];
    const monthFlag = monthData?.type;

    // The death week carries an end-cap type; it still opens a new row when it
    // begins a fresh month — mirror of renderMonthList so morph endpoints match.
    const deathWeekOpensMonth =
      i === lastWeekIndex &&
      !!monthData?.month &&
      (monthData.month !== currentRowMonth || monthData.year !== currentRowYear);

    const isFirst =
      i === 0 ||
      deathWeekOpensMonth ||
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
      if (monthData?.month && monthData?.year) {
        currentRowMonth = monthData.month;
        currentRowYear = monthData.year;
      }
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

  return buffer;
};
