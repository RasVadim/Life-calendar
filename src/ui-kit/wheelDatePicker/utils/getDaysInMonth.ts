import { getDaysInMonth as getDaysInMonthFn } from 'date-fns';

export const getDaysInMonth = (year: number, month: number): number => {
  return getDaysInMonthFn(new Date(year, month - 1, 1));
}; 