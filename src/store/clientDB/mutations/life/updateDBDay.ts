import { lifeCalendarDB, IWeek } from '@/store/clientDB';
import { TDay } from '@/types';

type TUpdateDBDayParams = {
  weekIndex: number;
  dayIndex: number;
  dayUpdates: Partial<TDay>;
};

/**
 * Update a single day within a week in the database
 * @param weekIndex - Index of the week containing the day
 * @param dayIndex - Index of the day to update
 * @param dayUpdates - Partial day data to update (only provided fields will be updated)
 */
export const updateDBDay = async ({ weekIndex, dayIndex, dayUpdates }: TUpdateDBDayParams) => {
  // Get the current week by index
  const week = await lifeCalendarDB.weeks.where('index').equals(weekIndex).first();

  if (!week) {
    throw new Error(`Week with index ${weekIndex} not found`);
  }

  if (dayIndex < 0 || dayIndex >= week.days.length) {
    throw new Error(`Day with index ${dayIndex} not found in week ${weekIndex}`);
  }

  // Update only the provided fields, keeping existing data for other fields
  const updatedDay: TDay = {
    ...week.days[dayIndex],
    ...dayUpdates,
  };

  // Create updated days array
  const updatedDays = [...week.days];
  updatedDays[dayIndex] = updatedDay;

  // Update the week with the modified days array
  const updatedWeek: IWeek = {
    ...week,
    days: updatedDays,
  };

  // Save the updated week
  await lifeCalendarDB.weeks.put(updatedWeek);

  return updatedDay;
};
