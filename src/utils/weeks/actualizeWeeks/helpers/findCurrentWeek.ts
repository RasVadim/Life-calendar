import { IWeek } from '@/store/clientDB';
import { findWithIndex } from '@/utils';

/**
 * Find the current week based on the current date
 */
export const findCurrentWeek = (weeks: IWeek[], currentDate: Date) => {
  return findWithIndex(
    weeks,
    (w) =>
      !!w.dateStart &&
      !!w.dateEnd &&
      new Date(w.dateStart) <= currentDate &&
      currentDate <= new Date(w.dateEnd),
  );
};
