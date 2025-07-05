import { IWeek, UserDataEntity } from '@/store/clientDB/lifeCalendarDB';
import { TWeekZodiac } from '@/types';

export type LabelData = {
  text: string;
  year: string; // startYear as string
  rowIndex: number;
  startYear: number;
  endYear: number;
  startYearZodiacLabel: TWeekZodiac | null;
  endYearZodiacLabel: TWeekZodiac | null;
};

/**
 * Generates row labels for the life calendar grid (years mode).
 * For each year of user's life, finds the first and last week,
 * and uses their calendar years (dateYear) and zodiac labels.
 *
 * @param weeks - Array of week objects (IWeek[]), sorted by date ascending
 * @param userData - User data object (UserDataEntity), must contain birthDate
 * @returns Array of label data for each year of life, where each label contains:
 *   - text: string (e.g. "1991 – 1992")
 *   - year: string (start calendar year)
 *   - rowIndex: number (zero-based index for grid row)
 *   - startYear: number (calendar year of first week in year of life)
 *   - endYear: number (calendar year of last week in year of life)
 *   - startYearZodiacLabel: TWeekZodiac | null (zodiac for start year)
 *   - endYearZodiacLabel: TWeekZodiac | null (zodiac for end year)
 *
 * The function groups weeks by the user's "years of life" (from birthday to next birthday),
 * and for each such year forms a label with the correct calendar year range and zodiac info.
 */
export const useRowLabels = (weeks: IWeek[], userData: UserDataEntity | undefined): LabelData[] => {
  if (!weeks.length || !userData?.birthDate) return [];

  // Group weeks by "years of life" of the user
  const labels: LabelData[] = [];
  let currentLifeYearWeeks: IWeek[] = [];
  let prevYear = null;
  let rowIndex = 0;

  for (let i = 0; i < weeks.length; i++) {
    const week = weeks[i];
    // Первый проход — просто добавляем
    if (currentLifeYearWeeks.length === 0) {
      currentLifeYearWeeks.push(week);
      prevYear = week.year;
      continue;
    }
    // If the year of the week matches the previous one — add it
    if (week.year === prevYear) {
      currentLifeYearWeeks.push(week);
    } else {
      // New year of life — form a label for the previous one
      const firstWeek = currentLifeYearWeeks[0];
      const lastWeek = currentLifeYearWeeks[currentLifeYearWeeks.length - 1];
      const startYear = Number(firstWeek.dateYear);
      const endYear = Number(lastWeek.dateYear);
      labels.push({
        text: `${startYear} – ${endYear}`,
        year: String(startYear),
        rowIndex,
        startYear,
        endYear,
        startYearZodiacLabel: firstWeek.yearZodiacLabel,
        endYearZodiacLabel: lastWeek.yearZodiacLabel,
      });
      rowIndex++;
      // Start a new year of life
      currentLifeYearWeeks = [week];
      prevYear = week.year;
    }
  }
  // Add the last year of life
  if (currentLifeYearWeeks.length > 0) {
    const firstWeek = currentLifeYearWeeks[0];
    const lastWeek = currentLifeYearWeeks[currentLifeYearWeeks.length - 1];
    const startYear = Number(firstWeek.dateYear);
    const endYear = Number(lastWeek.dateYear);
    labels.push({
      text: `${startYear} – ${endYear}`,
      year: String(startYear),
      rowIndex,
      startYear,
      endYear,
      startYearZodiacLabel: firstWeek.yearZodiacLabel,
      endYearZodiacLabel: lastWeek.yearZodiacLabel,
    });
  }
  return labels;
};
