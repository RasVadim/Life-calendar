import { FC } from 'react';

import { useTranslation } from '@/hooks';
import { CircleLineIcon } from '@/icons';
import { IWeek } from '@/store/clientDB';
import { checkEvenMonth, checkEvenSeason } from '@/utils';

import { Comments, Holidays, Seasons, WeekTitle } from './components';
import { EAgeTextType, useAgeText } from '../../hooks';

import s from './s.module.styl';

type TProps = {
  week?: IWeek;
};

export const WeekInfo: FC<TProps> = ({ week }) => {
  const { t } = useTranslation();

  // Get age text using custom hook - must be called before early return
  const { weekNumberText, ageText } = useAgeText({
    lifeYear: week?.lifeYear,
    lifeMonth: week?.lifeMonth,
    weekIndex: week?.index,
  });

  if (!week) return null;

  const {
    description,
    month,
    year,
    dateStart,
    dateEnd,
    secondMonth,
    season,
    secondSeason,
    holidays,
    comments,
    isLeapYear,
    secondYear,
    yearZodiacLabel,
  } = week;

  // Format labels
  const monthLabel = t(`life.${month}`);
  const secondMonthLabel = secondMonth ? t(`life.${secondMonth}`) : '';

  // Format dates
  const dates = `${dateStart?.slice(8, 10)} - ${dateEnd?.slice(8, 10)}`;

  // Check even states
  const isEvenMonth = checkEvenMonth(month);
  const isEvenSeason = checkEvenSeason(season);

  // Format holidays text
  const holidaysText = holidays?.map((holiday) => t(`life.holidays.${holiday}`)).join(', ');

  return (
    <div className={s.wrapper}>
      <WeekTitle
        year={year}
        secondYear={secondYear}
        monthLabel={monthLabel}
        secondMonthLabel={secondMonthLabel}
        dates={dates}
        isLeapYear={isLeapYear}
        isEvenMonth={!!isEvenMonth}
        yearZodiacLabel={yearZodiacLabel}
      />

      <div className={s.weekNumber}>
        <CircleLineIcon size={'10'} />
        {weekNumberText} {t('layout.weekOfLife')}
      </div>

      {ageText && (
        <div className={s.age}>
          {ageText.type === EAgeTextType.Months && t('layout.youWereMonthsOld', ageText)}
          {ageText.type === EAgeTextType.YearsWithMonths && t('layout.youWereYearsOld', ageText)}
          {ageText.type === EAgeTextType.YearsOnly && t('layout.youWereYearsOldNoMonths', ageText)}
        </div>
      )}

      <Seasons season={season} secondSeason={secondSeason} isEvenSeason={!!isEvenSeason} />

      <Holidays holidaysText={holidaysText} />

      {description && <div className={s.description}>{description}</div>}

      <Comments comments={comments} />
    </div>
  );
};
