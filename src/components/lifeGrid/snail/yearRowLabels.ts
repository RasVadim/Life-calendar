import { IWeek } from '@/store/clientDB';
import { EYearsWeekIndxsValues, TWeekIndxsMap } from '@/types';

export type TYearRowLabel = { row: number; start: string; end: string };

/**
 * Per-row calendar years for the years grid (wide-screen gutters).
 *
 * Walks the weeks with the exact same row-advance rules as `renderYearList`, so
 * `row` lines up 1:1 with the rendered grid rows. Weeks are chronological (Dexie
 * keys them by a YYYYMMDD id), so `weeks[i].year` matches week index `i`.
 * `start` = year the life-year began (left gutter), `end` = year it ended (right).
 */
export const computeYearRowLabels = (
  weeks: IWeek[],
  yearsIndxs: TWeekIndxsMap<EYearsWeekIndxsValues>,
  lastWeekIndex: number,
): TYearRowLabel[] => {
  if (!weeks.length) return [];

  const perRow = new Map<number, { start: string; end: string }>();
  const put = (row: number, year?: string) => {
    if (!year) return;
    const entry = perRow.get(row);
    if (entry) entry.end = year;
    else perRow.set(row, { start: year, end: year });
  };

  let currentRow = 0;
  for (let i = 0; i <= lastWeekIndex; i += 1) {
    const year = weeks[i]?.year;
    switch (yearsIndxs[i]) {
      case EYearsWeekIndxsValues.Half:
        // Edge halves (birth / death) stay on the current row; a mid-year split
        // week straddles two rows, so record its year on both.
        if (i === 0 || i === lastWeekIndex) {
          put(currentRow, year);
        } else {
          put(currentRow, year);
          currentRow += 1;
          put(currentRow, year);
        }
        break;
      case EYearsWeekIndxsValues.HalfLeap:
        currentRow += 1;
        put(currentRow, year);
        break;
      case EYearsWeekIndxsValues.FullFirst:
        if (i !== 0) currentRow += 1;
        put(currentRow, year);
        break;
      default:
        put(currentRow, year);
    }
  }

  return [...perRow.entries()].map(([row, { start, end }]) => ({ row, start, end }));
};
