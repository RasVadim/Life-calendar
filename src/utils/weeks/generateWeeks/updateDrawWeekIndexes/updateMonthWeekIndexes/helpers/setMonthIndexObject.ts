import {
  EMonthsEndsIndxsValues,
  EMonthsWeekIndxsValues,
  TDrawWeekIndexes,
  TMonthsIndxsValue,
} from '@/types';
import { TWeekMeta } from '@/utils/weeks/generateWeeks/types';

import { getMonthInfo, TMonthInfo } from './getMonthInfo';
import { formatMonthNumber } from '../../../helpers';

type TSetMonthIndexObjectParams = {
  type: EMonthsWeekIndxsValues | EMonthsEndsIndxsValues;
  weekTimePoints: { weekStart: Date; weekEnd: Date }[];
  currentWeekIndex: number;
  meta: TWeekMeta;
  drawWeekIndexes: TDrawWeekIndexes;
  monthInfo?: TMonthInfo;
};

/**
 * Creates and sets month index object
 */
export const setMonthIndexObject = ({
  type,
  weekTimePoints,
  currentWeekIndex,
  meta,
  drawWeekIndexes,
  monthInfo,
}: TSetMonthIndexObjectParams) => {
  const { year, month } = monthInfo || getMonthInfo({ weekTimePoints, currentWeekIndex });
  const monthNumber = formatMonthNumber(month);
  const yearNumber = String(year);

  const monthObject: TMonthsIndxsValue = {
    type,
    month: monthNumber,
    year: yearNumber,
  };

  if (meta.media) {
    monthObject.media = meta.media;
  }

  drawWeekIndexes.monthsIndxs[currentWeekIndex] = monthObject;
};
