import { IWeek } from '@/store/clientDB';
import { EMonthsWeekIndxsValues, TDrawWeekIndexes } from '@/types';

import { TWeekMeta } from '../../types';

type TUpdateMonthWeekIndexesParams = {
  drawWeekIndexes: TDrawWeekIndexes;
  currentWeekIndex: number;
  weekTimePoints: { weekStart: Date; weekEnd: Date }[];
  meta: TWeekMeta;
  previousWeek: IWeek | null;
};

/**
 * Updates the month week indexes
 * @param {TUpdateMonthWeekIndexesParams} params - The parameters for the update
 */
export const updateMonthWeekIndexes = ({
  drawWeekIndexes,
  currentWeekIndex,
  weekTimePoints,
  meta,
  previousWeek,
}: TUpdateMonthWeekIndexesParams) => {
  // Check if week spans across two months
  const isWeekInTwoMonths = !!meta.secondMonth;

  // Check if this is a border week (contains two months)
  if (isWeekInTwoMonths) {
    drawWeekIndexes.monthsIndxs[currentWeekIndex] = EMonthsWeekIndxsValues.Border;
    return;
  }

  // old //  ПОКА что нам не надо расчитывать что неделя начинается в пн и заканчивается в вс
  // old //  - ОНИ ВСЕ начинаются с пн и заканчиваются в вс кроме 1ой и последней неделив жизни человека !

  // Check if this is a border end week (month ends on Sunday)
  if (!isWeekInTwoMonths) {
    // УПРОЩАЕМ !!! ПОМНИМ ВАЖНА ПРОИЗВОДИТЕЛЬНОСТЬ !!!
    // бепоследний день текущей недели ! легко ? легко  дата dateEnd у нас есть !
    // берем следующий день после dateEnd ! можно ? можно !!! и быстро!
    // далее просто сравниваем месяцы этих дней и все различаются ставим BorderEnd нет - нет

    const currentWeekEnd = new Date(weekTimePoints[currentWeekIndex].weekEnd);
    const nextDay = new Date(currentWeekEnd);
    nextDay.setDate(nextDay.getDate() + 1);

    // If next day is in different month, current week ends the month
    if (nextDay.getMonth() !== currentWeekEnd.getMonth()) {
      drawWeekIndexes.monthsIndxs[currentWeekIndex] = EMonthsWeekIndxsValues.BorderEnd;
      return;
    }
  }

  // Check if month starts on Monday
  if (!isWeekInTwoMonths && previousWeek) {
    // old //  итак для простоты вычисления я добавил сюда previousWeek итого мы можем просто проверить
    // old //  если последния день предыдущей недели - например январь - а первый день текущей недели - февраль -
    // old //  то этот месяц начинается с полной недели

    // ПРОБУЕМ УПРОСТИТЬ ВЫЧИСЛЕНИЯ!!! итак мы знаем что у нас десть dateStart и dateEnd!! у currentWeek и previousWeek!!
    const previousWeekEnd = new Date(previousWeek.dateEnd);
    const currentWeekStart = new Date(weekTimePoints[currentWeekIndex].weekStart);

    const previousMonth = previousWeekEnd.getMonth();
    const currentMonth = currentWeekStart.getMonth();

    // If previous week ended in different month than current week starts
    if (previousMonth !== currentMonth) {
      // old // далее мы проверяем сколько полных недель в этом месяце если их 4 и еще остается 1 или 2 или 3 дня - то текущую неделю помечаем как FirstFull5
      // old //  если полных недель 4 включая первую и последнюю и дополнительных дней этого месяца не остается то помечаем как FirstFull4

      // ПРОБУЕМ УПРОСТИТЬ ВЫЧИСЛЕНИЯ!!! Итак мы знаем что текущая неделя своим понедельником начинает текущий месяц !!
      // значит нам нужно узнать сколько дней в этом месяце и разделить на 7 - посмотреть на полное число и на остаток !!!
      // и все станет ясно - сколько полных недель в месяце ровно 4 или 4 и сколько то дней!!

      // Get number of days in current month
      const year = currentWeekStart.getFullYear();
      const month = currentWeekStart.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      // Calculate how many full weeks fit in this month
      const fullWeeksInMonth = Math.floor(daysInMonth / 7);
      const remainingDays = daysInMonth % 7;

      // If there are 4 full weeks and some remaining days -> FirstFull5
      // If there are exactly 4 full weeks with no remaining days -> FirstFull4
      if (fullWeeksInMonth === 4 && remainingDays > 0) {
        drawWeekIndexes.monthsIndxs[currentWeekIndex] = EMonthsWeekIndxsValues.FirstFull5;
      } else if (fullWeeksInMonth === 4 && remainingDays === 0) {
        drawWeekIndexes.monthsIndxs[currentWeekIndex] = EMonthsWeekIndxsValues.FirstFull4;
      }
      return;
    }
  }

  // Check if this is first full week after border week
  if (!isWeekInTwoMonths && previousWeek) {
    // old //  тут так же как и с firstFull4 и firstFull5 -   НО ВАЖНО учитывать что кусочек текущего месяца может оказаться выше -
    // old //  в послденей неделе предыдущего месяца
    // old //  получается что мы считаем полные недели - если их 4 и еще остается 1 или 2 (3 уже быть не может)
    // old //  - то текущую неделю помечаем как First5, если у нас ровно 4 полных недели (а последний день этого месяца вс
    // old //  - и к примеру 1ое или 2ое или 3тье числа попали в предыдущую неделю (пограничную для двух месяцев) тоесть  были пт сб или вс) то помечаем как First4

    const previousWeekEnd = new Date(previousWeek.dateEnd);
    const previousWeekStart = new Date(previousWeek.dateStart);
    const currentWeekStart = new Date(weekTimePoints[currentWeekIndex].weekStart);

    // Check if previous week was a border week (contained two months)
    const wasPreviousWeekBorder = previousWeekEnd.getMonth() !== previousWeekStart.getMonth();

    // If previous week was border week, calculate days from current week start
    if (wasPreviousWeekBorder) {
      // Get number of days in current month
      const year = currentWeekStart.getFullYear();
      const month = currentWeekStart.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();

      // Calculate how many days are left in month starting from current week
      const currentWeekStartDay = currentWeekStart.getDate();
      const daysLeftInMonth = daysInMonth - currentWeekStartDay + 1;

      // Calculate how many full weeks fit in remaining days
      const fullWeeksLeft = Math.floor(daysLeftInMonth / 7);
      const remainingDays = daysLeftInMonth % 7;

      // If there are 4 full weeks and some remaining days -> First5
      // If there are exactly 4 full weeks with no remaining days -> First4
      if (fullWeeksLeft === 4 && remainingDays > 0) {
        drawWeekIndexes.monthsIndxs[currentWeekIndex] = EMonthsWeekIndxsValues.First5;
      } else if (fullWeeksLeft === 4 && remainingDays === 0) {
        drawWeekIndexes.monthsIndxs[currentWeekIndex] = EMonthsWeekIndxsValues.First4;
      }
      return;
    }
  }
};
