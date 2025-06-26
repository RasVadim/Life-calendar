import { IWeek, lifeCalendarDB, updateTodayWeekId, updateWeek } from '@/store/clientDB';
import { EWeekType } from '@/types/life';

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

  // Find the week for the current date
  const nowWeek = weeks.find(
    (w) => w.dateStart && w.dateEnd && new Date(w.dateStart) <= now && now <= new Date(w.dateEnd),
  );
  if (!nowWeek) return;
  const nowWeekId = nowWeek.id;

  // If todayWeekId matches the current week, do nothing
  if (prevTodayWeekId === nowWeekId) return;

  // Find indices
  const prevIdx = weeks.findIndex((w) => w.id === prevTodayWeekId);
  const nowIdx = weeks.findIndex((w) => w.id === nowWeekId);
  if (prevIdx === -1 || nowIdx === -1) return;

  // Define the range for updating
  const [from, to] = prevIdx < nowIdx ? [prevIdx, nowIdx] : [nowIdx, prevIdx];
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
  await updateTodayWeekId(nowWeekId);
};
