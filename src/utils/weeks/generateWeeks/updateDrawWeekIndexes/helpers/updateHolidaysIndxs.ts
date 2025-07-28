import { TDrawWeekIndexes, THolidayName } from '@/types';

type TUpdateHolidayIndxsParams = {
  drawWeekIndexes: TDrawWeekIndexes;
  weekIndex: number;
  holidays?: THolidayName[];
};

export const updateHolidaysIndxs = ({
  drawWeekIndexes,
  weekIndex,
  holidays,
}: TUpdateHolidayIndxsParams) => {
  if (holidays?.[0]) {
    drawWeekIndexes.holidaysIndxs[weekIndex] = holidays[0];
  }
};
