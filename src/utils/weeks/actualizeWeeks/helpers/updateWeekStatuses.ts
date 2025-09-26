import { IWeek, updateDBWeek } from '@/store/clientDB';
import { getWeekType } from '@/utils';

/**
 * Update week statuses for the given range of weeks
 */
export const updateWeekStatuses = async (
  weeks: IWeek[],
  fromIndex: number,
  toIndex: number,
  currentDate: Date,
): Promise<void> => {
  const toUpdate = weeks.slice(fromIndex, toIndex + 1);
  if (toUpdate.length === 0) return;

  const updatedWeeks: IWeek[] = [];

  for (const week of toUpdate) {
    const newType = getWeekType(week.dateStart, week.dateEnd, currentDate);

    if (week.type !== newType) {
      updatedWeeks.push({ ...week, type: newType });
    }
  }

  if (updatedWeeks.length === 0) return;

  // Update all changed weeks in parallel
  await Promise.all(updatedWeeks.map((week) => updateDBWeek(week)));
};
