import { TDrawWeekIndexes, THolidayName } from '@/types';

type TUpdateHolidayIndxsParams = {
  drawWeekIndexes: TDrawWeekIndexes;
  weekIndex: number;
  holidays?: THolidayName[];
};

/**
 * Updates holiday indexes for a specific week
 * Sets the first holiday from the array as the week's holiday index
 * @param {TUpdateHolidayIndxsParams} params - The parameters for the update
 */
export const updateHolidaysIndxs = ({
  drawWeekIndexes,
  weekIndex,
  holidays,
}: TUpdateHolidayIndxsParams) => {
  if (holidays?.[0]) {
    drawWeekIndexes.holidaysIndxs[weekIndex] = holidays[0];
  }
};
