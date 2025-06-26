import { LIFE_GRID_ZOOM_LEVELS } from '@/constants';
import { useTranslation } from '@/hooks';
import { IWeek, UserDataEntity } from '@/store/clientDB/lifeCalendarDB';
import { ESeason } from '@/types/life';

export type LabelData = {
  text: string;
  month?: string;
  season?: string;
  year?: string;
  rowIndex: number;
};

/**
 * Returns the next season for a given ESeason value.
 */
const getNextSeason = (season: ESeason): ESeason => {
  switch (season) {
    case ESeason.Winter:
      return ESeason.Spring;
    case ESeason.Spring:
      return ESeason.Summer;
    case ESeason.Summer:
      return ESeason.Autumn;
    case ESeason.Autumn:
    default:
      return ESeason.Winter;
  }
};

/**
 * React hook for generating row labels for the life calendar grid (seasons/months modes).
 *
 * Returns an array of label objects for each row, with localized season/month and year.
 *
 * @param weeks - Array of week objects (IWeek[])
 * @param userData - User data object (UserDataEntity)
 * @param columns - Number of columns in the grid (4 for months, 13 for seasons)
 * @returns Array of label data for each row
 *
 * @example
 * const labels = useRowLabels(weeks, userData, columns);
 * // labels: [{ text: 'Март 1991', month: 'Март', season: '', year: '1991', rowIndex: 0 }, ...]
 */
export const useRowLabels = (
  weeks: IWeek[],
  userData: UserDataEntity | undefined,
  columns: number,
): LabelData[] => {
  const { t } = useTranslation();

  if (!weeks.length || !userData?.birthDate) return [];

  if (columns === LIFE_GRID_ZOOM_LEVELS.seasons) {
    const labels: LabelData[] = [];
    const rowsCount = Math.ceil(weeks.length / 13);
    // start from the season and year of the first week
    const firstWeek = weeks[0];
    let season = firstWeek.dateSeason;
    let year = +firstWeek.dateYear;
    for (let row = 0; row <= rowsCount; row++) {
      labels.push({
        text: `${t(`life.${season}`)} ${year}`,
        month: '',
        season: t(`life.${season}`),
        year: year.toString(),
        rowIndex: row,
      });
      // next season
      season = getNextSeason(season as ESeason);
      if (season === ESeason.Winter) {
        year++;
      }
    }
    return labels;
  } else if (columns === LIFE_GRID_ZOOM_LEVELS.months) {
    const labels: LabelData[] = [];
    const rowsCount = Math.ceil(weeks.length / 4);
    for (let row = 0; row < rowsCount; row++) {
      const weekIdx = row * 4;
      const week = weeks[weekIdx];
      if (!week) continue;
      labels.push({
        text: `${t(`life.${week.dateMonth}`)} ${week.dateYear}`,
        month: t(`life.${week.dateMonth}`),
        season: '',
        year: week.dateYear,
        rowIndex: row,
      });
    }
    // add last month if it's not in the labels
    const lastWeek = weeks[weeks.length - 1];
    if (lastWeek) {
      const lastMonthKey = `${lastWeek.dateMonth}_${lastWeek.dateYear}`;
      const hasLastMonth = labels.some(
        (l) =>
          `${weeks[l.rowIndex * 4]?.dateMonth}_${weeks[l.rowIndex * 4]?.dateYear}` === lastMonthKey,
      );
      if (!hasLastMonth) {
        labels.push({
          text: `${t(`life.${lastWeek.dateMonth}`)} ${lastWeek.dateYear}`,
          month: t(`life.${lastWeek.dateMonth}`),
          season: '',
          year: lastWeek.dateYear,
          rowIndex: rowsCount, // последний индекс
        });
      }
    }
    return labels;
  }
  return [];
};
