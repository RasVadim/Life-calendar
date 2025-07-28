import { HOLIDAY_NAMES } from '@/constants';
import { EYearsWeekIndxsValues, TDrawWeekIndexes } from '@/types';

import { getLifeYear } from '../../helpers';
import { TWeekMeta } from '../../types';

type TUpdateYearWeekIndexesParams = {
  drawWeekIndexes: TDrawWeekIndexes;
  lifeYear: number;
  secondLifeYear: number;
  currentWeekIndex: number;
  weekIndex: number;
  weekDuration: number;
  isLeapYear: boolean;
  weekTimePoints: { weekStart: Date; weekEnd: Date }[];
  meta: TWeekMeta;
};

/**
 * Updates the year week indexes
 * @param {TUpdateYearWeekIndexesParams} params - The parameters for the update
 */
export const updateYearWeekIndexes = ({
  drawWeekIndexes,
  lifeYear,
  secondLifeYear,
  currentWeekIndex,
  isLeapYear,
  weekIndex,
  weekDuration,
  weekTimePoints,
  meta,
}: TUpdateYearWeekIndexesParams) => {
  // Check if week spans across two years of life
  const isWeekInTwoLIfeYears = secondLifeYear && lifeYear !== secondLifeYear;

  // Check if this is first week of life (less than 7 days)
  const isHalfFirstWeekOfLife = weekIndex === 0 && weekDuration < 7;

  // Check if this is last week of life (less than 7 days)
  const isHalfLastWeekOfLife = weekIndex === weekTimePoints.length - 1 && weekDuration < 7;

  const startsFromBirthday = Boolean(meta.days[0].holidays?.includes(HOLIDAY_NAMES.birthday));

  if (isLeapYear && isWeekInTwoLIfeYears) {
    const tuesdayLifeYear = getLifeYear(weekTimePoints[0].weekStart, new Date(meta.days[1].date));
    const isTuesdayInNextYear = tuesdayLifeYear !== lifeYear;
    if (isTuesdayInNextYear) {
      drawWeekIndexes.yearsIndxs[currentWeekIndex] = EYearsWeekIndxsValues.HalfLeap;
      return;
    }
  }

  // Add to yearsIndxs if week meets special conditions
  if (isWeekInTwoLIfeYears || isHalfFirstWeekOfLife || isHalfLastWeekOfLife) {
    drawWeekIndexes.yearsIndxs[currentWeekIndex] = EYearsWeekIndxsValues.Half;
    return;
  }

  if (startsFromBirthday) {
    drawWeekIndexes.yearsIndxs[currentWeekIndex] = EYearsWeekIndxsValues.FullFirst;
    return;
  }
};
