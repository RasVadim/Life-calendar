import { getYear, format } from 'date-fns';

import { ISO_DATE_FORMAT } from '@/constants';
import { IWeek } from '@/store/clientDB';
import { TDrawWeekIndexes } from '@/types';

import { getWeekHolidays, getLifeYear } from '../helpers';
import { updateDrawWeekIndexes } from '../updateDrawWeekIndexes';
import { getWeekMeta, getWeekNumber, getWeekType, getZodiac } from './helpers';

type TGenerateWeekParams = {
  weekTimePoints: { weekStart: Date; weekEnd: Date }[];
  weekIndex: number;
  birthDate: Date;
  weeks: IWeek[];
  drawWeekIndexes: TDrawWeekIndexes;
};

export const generateWeek = ({
  weekTimePoints,
  weekIndex,
  birthDate,
  weeks,
  drawWeekIndexes,
}: TGenerateWeekParams) => {
  const { weekStart, weekEnd } = weekTimePoints[weekIndex];
  const lifeYear = getLifeYear(birthDate, weekStart);
  const secondLifeYear = getLifeYear(birthDate, weekEnd);
  const previousWeek = weeks[weeks.length - 1] || null;
  const meta = getWeekMeta({
    weekStart,
    weekEnd,
    lifeYear,
    weekIndex,
    birthDate,
    previousWeek,
  });
  const type = getWeekType(weekStart, weekEnd);
  const holidays = getWeekHolidays(weekStart, weekEnd, birthDate);

  // Update draw week indexes
  updateDrawWeekIndexes({
    drawWeekIndexes,
    weekIndex,
    meta,
    lifeYear,
    secondLifeYear,
    weekTimePoints,
    currentWeekIndex: weeks.length,
    holidays,
  });

  // Efficient calculation of life month
  const yearsPassed = lifeYear;
  const monthOfWeek = weekStart.getMonth(); // 0-11
  const monthOfBirth = birthDate.getMonth(); // 0-11
  let monthsFromBirth = yearsPassed * 12 + (monthOfWeek - monthOfBirth);
  if (monthOfWeek < monthOfBirth) {
    monthsFromBirth += 12;
  }
  const dayOfWeek = weekStart.getDate();
  const dayOfBirth = birthDate.getDate();
  if (dayOfWeek < dayOfBirth) {
    monthsFromBirth -= 1;
  }
  const lifeMonth = monthsFromBirth + 1;

  const weekId = `w${getWeekNumber(weekIndex)}_y${String(lifeYear).padStart(3, '0')}`;

  return {
    id: weekId,
    dateStart: format(weekStart, ISO_DATE_FORMAT),
    dateEnd: format(weekEnd, ISO_DATE_FORMAT),
    type,
    lifeMonth,
    lifeYear,
    secondLifeYear: secondLifeYear === lifeYear ? null : secondLifeYear,
    year: meta.year,
    secondYear: meta.secondYear,
    month: meta.month,
    secondMonth: meta.secondMonth,
    season: meta.season,
    secondSeason: meta.secondSeason,
    isLeapYear: meta.isLeapYear,
    isSeasonPreview: meta.isSeasonPreview,
    isMonthPreview: meta.isMonthPreview,
    holidays,
    yearZodiacLabel: getZodiac(getYear(weekStart)),
    days: meta.days,
    comments: null,
    description: null,
  };
};
