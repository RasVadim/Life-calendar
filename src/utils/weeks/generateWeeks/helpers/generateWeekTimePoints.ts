import { addDays } from 'date-fns';

export type TWeekTimePoint = {
  weekStart: Date;
  weekEnd: Date;
};

const DAYS_IN_WEEK = 6; // Monday to Sunday (6 days difference)
const MONDAY = 1;

/**
 * Generates week time points from birth date to death date
 * @param birthDate - Start date for week generation
 * @param deathDate - End date for week generation
 * @returns Array of week time points with start and end dates
 */
export const generateWeekTimePoints = (birthDate: Date, deathDate: Date): TWeekTimePoint[] => {
  const weekTimePoints: TWeekTimePoint[] = [];
  let weekStart = birthDate;

  // Handle first week if it doesn't start on Monday
  if (weekStart.getDay() !== MONDAY) {
    const firstWeekEnd = getFirstWeekEnd(weekStart);
    weekTimePoints.push({ weekStart, weekEnd: firstWeekEnd });
    weekStart = addDays(firstWeekEnd, 1);
  }

  // Generate regular weeks
  while (weekStart < deathDate) {
    const weekEnd = addDays(weekStart, DAYS_IN_WEEK);
    const actualWeekEnd = weekEnd > deathDate ? deathDate : weekEnd;

    weekTimePoints.push({ weekStart, weekEnd: actualWeekEnd });
    weekStart = addDays(actualWeekEnd, 1);
  }

  return weekTimePoints;
};

/**
 * Calculates the end of the first week (to Sunday)
 * @param weekStart - Start date of the first week
 * @returns End date of the first week (Sunday)
 */
const getFirstWeekEnd = (weekStart: Date): Date => {
  const startDayOfWeek = weekStart.getDay();
  const daysToSunday = startDayOfWeek === 0 ? 0 : 7 - startDayOfWeek;
  return addDays(weekStart, daysToSunday);
};
