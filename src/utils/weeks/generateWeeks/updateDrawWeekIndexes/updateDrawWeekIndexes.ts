import { IWeek } from '@/store/clientDB';
import { TDrawWeekIndexes, THolidayName } from '@/types';

import {
  updateHolidaysIndxs,
  updateMonthWeekIndexes,
  updateSeasonWeekIndexes,
  updateYearWeekIndexes,
} from './';
import { TWeekMeta } from '../types';

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
  });

  updateSeasonWeekIndexes({
    drawWeekIndexes,
    currentWeekIndex,
    season: meta.season,
    secondSeason: meta.secondSeason,
    month: meta.month,
    year: meta.year,
    media: meta.media,
    previousWeek,
  });

  updateHolidaysIndxs({
    drawWeekIndexes,
    weekIndex,
    holidays,
  });

  drawWeekIndexes.lastWeekIndex = weekTimePoints.length - 1;
};
