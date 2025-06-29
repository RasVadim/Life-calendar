import { lifeCalendarDB, IWeek } from '@/store/clientDB';

/**
 * Update a single week in the database by id
 * @param week - week object to update (must contain id)
 */
export const updateWeek = async (week: IWeek) => {
  await lifeCalendarDB.weeks.put(week);
};
