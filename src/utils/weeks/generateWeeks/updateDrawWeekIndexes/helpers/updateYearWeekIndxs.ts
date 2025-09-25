import { HOLIDAY_NAMES } from '@/constants';
import { EYearsWeekIndxsValues, TDrawWeekIndexes } from '@/types';

import { getLifeYear } from '../../helpers';
import { TWeekMeta } from '../../types';

const FULL_WEEK_DAYS = 7;
const TUESDAY_DAY_INDEX = 1;

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
  const isWeekInTwoLifeYears = secondLifeYear && lifeYear !== secondLifeYear;

  // === HalfLeap ===
  if (isLeapYear && isWeekInTwoLifeYears) {
    // Life year of weeks can contain more than 53 full weeks only once every 7 leap years
    // It happens when last week has only 1 day (Monday) in one year and next day (Tuesday) in next year
    const tuesdayLifeYear = getLifeYear(
      weekTimePoints[0].weekStart,
      new Date(meta.days[TUESDAY_DAY_INDEX].date),
    );
    const isTuesdayInNextYear = tuesdayLifeYear !== lifeYear;
    if (isTuesdayInNextYear) {
      drawWeekIndexes.yearsIndxs[currentWeekIndex] = EYearsWeekIndxsValues.HalfLeap;
      return;
    }
  }

  // Check if this is first week of life (less than 7 days)
  const isHalfFirstWeekOfLife = weekIndex === 0 && weekDuration < FULL_WEEK_DAYS;

  // Check if this is last week of life (less than 7 days)
  const isHalfLastWeekOfLife =
    weekIndex === weekTimePoints.length - 1 && weekDuration < FULL_WEEK_DAYS;

  // === Half ===
  if (isWeekInTwoLifeYears || isHalfFirstWeekOfLife || isHalfLastWeekOfLife) {
    drawWeekIndexes.yearsIndxs[currentWeekIndex] = EYearsWeekIndxsValues.Half;
    return;
  }

  const startsFromBirthday = Boolean(meta.days[0].holidays?.includes(HOLIDAY_NAMES.birthday));

  // === FullFirst ===
  if (startsFromBirthday) {
    drawWeekIndexes.yearsIndxs[currentWeekIndex] = EYearsWeekIndxsValues.FullFirst;
    return;
  }
};
