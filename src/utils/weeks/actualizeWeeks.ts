import { IWeek, lifeCalendarDB, updateTodayWeek, updateWeek } from '@/store/clientDB';
import { EWeekType } from '@/types/life';
import { findWithIndex } from '@/utils';

/**
 * Checks and updates the statuses of weeks in the database if needed
 * (for example, when the app is launched or when the day changes)
 */
export const actualizeWeeks = async () => {
  // Get all weeks from the database
  const weeks: IWeek[] = await lifeCalendarDB.weeks.toArray();
  const now = new Date();

  // Get todayWeekId from meta
  const meta = await lifeCalendarDB.meta.get('main');
  const prevTodayWeekId = meta?.todayWeekId;
  const prevIndex = meta?.todayWeekIndex || 0;

  // Find the week for the current date
  const founded = findWithIndex(
    weeks,
    (w) =>
      !!w.dateStart && !!w.dateEnd && new Date(w.dateStart) <= now && now <= new Date(w.dateEnd),
  );

  if (!founded) return;
  const { item: nowWeek, index: nowIndex } = founded;

  if (!nowWeek) return;
  const nowWeekId = nowWeek.id;

  if (prevTodayWeekId === nowWeekId) return;

  if (prevIndex === -1 || nowIndex === -1) return;

  // Define the range for updating
  const [from, to] = prevIndex < nowIndex ? [prevIndex, nowIndex] : [nowIndex, prevIndex];
  const toUpdate = weeks.slice(from, to + 1);

  // Update the statuses only for the needed weeks
  const updatedWeeks: IWeek[] = [];
  for (const week of toUpdate) {
    let newType: EWeekType = week.type;
    if (now < new Date(week.dateStart)) {
      newType = EWeekType.Future;
    } else if (now > new Date(week.dateEnd)) {
      newType = EWeekType.Past;
    } else {
      newType = EWeekType.Present;
    }
    if (week.type !== newType) {
      updatedWeeks.push({ ...week, type: newType });
    }
  }
  for (const w of updatedWeeks) {
    await updateWeek(w);
  }
  // Update todayWeekId in meta
  await updateTodayWeek({ todayWeekId: nowWeekId, todayWeekIndex: nowIndex });
};
