import { FC } from 'react';

import { useTranslation } from '@/hooks';
import { CircleLineIcon } from '@/icons';
import { IWeek } from '@/store/clientDB';

import { Comments, Holidays, Seasons, WeekTitle } from './components';
import { useAgeText } from '../../hooks';

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
    dateStart: week?.dateStart,
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

  // Format dates
  const dates = `${dateStart?.slice(8, 10)} - ${dateEnd?.slice(8, 10)}`;

  // Format holidays text
  const holidaysText = holidays?.map((holiday) => t(`life.holidays.${holiday}`)).join(', ');

  return (
    <div className={s.wrapper}>
      <WeekTitle
        year={year}
        secondYear={secondYear}
        month={month}
        secondMonth={secondMonth}
        dates={dates}
        isLeapYear={isLeapYear}
        yearZodiacLabel={yearZodiacLabel}
      />

      <div className={s.weekNumber}>
        <CircleLineIcon size={'10'} />
        {weekNumberText} {t('layout.weekOfLife')}
      </div>

      {ageText && <div className={s.age}>{ageText}</div>}

      <Seasons season={season} secondSeason={secondSeason} />

      <Holidays holidaysText={holidaysText} />

      {description && <div className={s.description}>{description}</div>}

      <Comments comments={comments} />
    </div>
  );
};
