import { lifeCalendarDB } from '@/store/clientDB';

type UpdateDrawWeekIndexesParams = {
  weekIndex: number;
  dateKey: string;
};

/**
 * Updates drawWeekIndexes with new media dateKey for specific week using direct update
 */
export const updateDBMonthWeekIndexes = async ({
  weekIndex,
  dateKey,
}: UpdateDrawWeekIndexesParams): Promise<void> => {
  await lifeCalendarDB.drawWeekIndexes
    .where('id')
    .equals('main')
    .modify((record) => {
      if (record.monthsIndxs[weekIndex]) {
        record.monthsIndxs[weekIndex].media = dateKey;
      }
    });
};
