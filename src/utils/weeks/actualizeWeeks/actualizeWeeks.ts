import { lifeCalendarDB, updateDBTodayWeek } from '@/store/clientDB';
import { calculateTodayDayInfo } from '@/utils';

import { updateWeekStatuses, findCurrentWeek, validateWeekChange } from './helpers';

/**
 * Checks and updates the statuses of weeks in the database if needed
 * (for example, when the app is launched or when the day changes)
 */
export const actualizeWeeks = async () => {
  const now = new Date();

  // Get all required data in parallel
  const [weeks, userData, meta] = await Promise.all([
    lifeCalendarDB.weeks.toArray(),
    lifeCalendarDB.userData.get('main'),
    lifeCalendarDB.meta.get('main'),
  ]);

  const birthDate = userData?.birthDate ? new Date(userData.birthDate) : null;
  const prevTodayWeekId = meta?.todayWeekId;
  const prevIndex = meta?.todayWeekIndex || 0;

  // Find the week for the current date
  const founded = findCurrentWeek(weeks, now);

  if (!founded) return;
  const { item: nowWeek, index: nowIndex } = founded;

  if (!nowWeek) return;
  const nowWeekId = nowWeek.id;

  // Validate if week change is needed
  const validation = validateWeekChange(prevTodayWeekId, nowWeekId, prevIndex, nowIndex);
  if (!validation.shouldUpdate) return;

  // Define the range for updating
  const [from, to] = prevIndex < nowIndex ? [prevIndex, nowIndex] : [nowIndex, prevIndex];

  // Update week statuses and calculate today info in parallel
  const [, todayInfo] = await Promise.all([
    updateWeekStatuses(weeks, from, to, now),
    Promise.resolve(calculateTodayDayInfo(nowWeek, now, birthDate)),
  ]);

  // Update all today information in meta
  await updateDBTodayWeek({
    todayWeekId: nowWeekId,
    todayWeekIndex: nowIndex,
    ...todayInfo,
  });
};
