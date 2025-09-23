import { IWeek } from '@/store/clientDB';
import { TDrawWeekIndexes, THolidayName, TMediasWeekIndxsValues, TMediaDatesMap } from '@/types';

import { TWeekMeta } from '../types';
import { updateHolidaysIndxs, updateMonthWeekIndexes, updateYearWeekIndexes } from './helpers';

type TUpdateDrawWeekIndexesParams = {
  drawWeekIndexes: TDrawWeekIndexes;
  weekIndex: number;
  meta: TWeekMeta;
  lifeYear: number;
  secondLifeYear: number;
  weekTimePoints: { weekStart: Date; weekEnd: Date }[];
  currentWeekIndex: number;
  holidays: THolidayName[];
  previousWeek: IWeek | null;
  media: TMediaDatesMap<TMediasWeekIndxsValues>;
};

/**
 * Updates the draw week indexes
 * @param {TUpdateDrawWeekIndexesParams} params - The parameters for the update
 */
export const updateDrawWeekIndexes = ({
  drawWeekIndexes,
  weekIndex,
  meta,
  lifeYear,
  secondLifeYear,
  weekTimePoints,
  currentWeekIndex,
  holidays,
  previousWeek,
  media,
}: TUpdateDrawWeekIndexesParams) => {
  // Calculate week duration in days
  const weekDuration = meta.days.length;

  updateYearWeekIndexes({
    drawWeekIndexes,
    lifeYear,
    secondLifeYear,
    currentWeekIndex,
    weekDuration,
    isLeapYear: meta.isLeapYear,
    weekIndex,
    weekTimePoints,
    meta,
  });

  updateMonthWeekIndexes({
    drawWeekIndexes,
    currentWeekIndex,
    weekTimePoints,
    meta,
    previousWeek,
    media,
  });

  updateHolidaysIndxs({
    drawWeekIndexes,
    weekIndex,
    holidays,
  });

  drawWeekIndexes.lastWeekIndex = weekTimePoints.length - 1;
};
