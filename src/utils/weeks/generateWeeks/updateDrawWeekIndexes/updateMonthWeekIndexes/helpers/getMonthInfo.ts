import { getDaysInMonth } from './getDaysInMonth';

type TGetMonthInfoParams = {
  weekTimePoints: { weekStart: Date; weekEnd: Date }[];
  currentWeekIndex: number;
  currentWeekStart?: Date;
};

export type TMonthInfo = {
  year: number;
  month: number;
  daysInMonth: number;
  currentWeekStartDay: number;
};

/**
 * Common logic for getting month information
 */
export const getMonthInfo = ({
  weekTimePoints,
  currentWeekIndex,
  currentWeekStart,
}: TGetMonthInfoParams): TMonthInfo => {
  const weekStart = currentWeekStart || new Date(weekTimePoints[currentWeekIndex].weekStart);
  const year = weekStart.getFullYear();
  const month = weekStart.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const currentWeekStartDay = weekStart.getDate();

  return { year, month, daysInMonth, currentWeekStartDay };
};
