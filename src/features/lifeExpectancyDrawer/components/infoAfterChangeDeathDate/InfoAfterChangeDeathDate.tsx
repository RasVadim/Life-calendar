import { FC, useEffect, useState } from 'react';

import cx from 'classnames';
import {
  format,
  differenceInYears,
  parseISO,
  differenceInMonths,
  differenceInWeeks,
  differenceInDays,
} from 'date-fns';
import { enUS, ru } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

import { DEFAULT_BIRTH_DATE } from '@/constants';
import { Button } from '@/ui-kit';
import {
  getYearsWordGenitive,
  getYearsWordDative,
  getWeekdayPrepositional,
  getMonthsWord,
  getWeeksWord,
  getDaysWord,
  getHoursWord,
} from '@/utils';

import s from './s.module.styl';

interface Props {
  birthDate: string;
  deathDate: string;
  lifeExpectancy: number;
  isDeathDateChanged: boolean;
  onButtonClick?: () => void;
}

export const InfoAfterChangeDeathDate: FC<Props> = ({
  birthDate,
  deathDate,
  lifeExpectancy,
  onButtonClick,
  isDeathDateChanged,
}) => {
  const { t, i18n } = useTranslation();

  const now = new Date();
  const birth = parseISO(birthDate || DEFAULT_BIRTH_DATE);
  const age = differenceInYears(now, birth);
  const locale = i18n.language === 'ru' ? ru : enUS;
  const weekday = format(birth, 'EEEE', { locale });
  const weekdayDisplay = getWeekdayPrepositional(weekday, i18n.language);
  const months = differenceInMonths(now, birth);
  const weeks = differenceInWeeks(now, birth);
  const days = differenceInDays(now, birth);
  const sleepHours = Math.round(days * 8);
  const sleepHoursInYearsInt = Math.round(sleepHours / 24 / 365.25);

  const showSleepYears = sleepHoursInYearsInt > 0;
  const yearsWord = getYearsWordDative(age, i18n.language);
  const sleepYearsWord = showSleepYears
    ? getYearsWordGenitive(sleepHoursInYearsInt, i18n.language)
    : '';

  return (
    <>
      <div className={cx(s.resultText, { [s.visible]: true })}>
        {t('life.birthDateDrawerResult', {
          age,
          weekday: weekdayDisplay,
          yearsWord,
        })}
      </div>
      <div className={cx(s.statsText, { [s.visible]: true })}>
        {t('life.birthDateDrawerStats', {
          months,
          monthsWord: getMonthsWord(months, i18n.language),
          weeks,
          weeksWord: getWeeksWord(weeks, i18n.language),
          days,
          daysWord: getDaysWord(days, i18n.language),
          sleepHours,
          hoursWord: getHoursWord(sleepHours, i18n.language),
        })}
        {showSleepYears && (
          <div style={{ marginTop: 8 }}>
            {t('life.birthDateDrawerSleepYears', {
              sleepHoursInYears: sleepHoursInYearsInt,
              sleepYearsWord,
            })}
          </div>
        )}
      </div>
      <div
        className={cx(s.statsText, s.lifeExpectancy, {
          [s.visible]: true,
        })}
      >
        {t('life.birthDateDrawerLifeExpectancy')}
      </div>
      <div
        className={cx(s.statsText, s.finalBlock, {
          [s.visible]: true,
        })}
      >
        <>
          <div>{t('life.birthDateDrawer90YearsSleep')}</div>
          {isDeathDateChanged && <Button onClick={onButtonClick} label={t('life.letsSee')} />}
        </>
      </div>
    </>
  );
};
