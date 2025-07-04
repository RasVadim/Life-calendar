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

import { DEFAULT_BIRTH_DATE, DEFAULT_LIFE_SPAN_YEARS } from '@/constants';
import { useTranslation } from '@/hooks';
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

const SHOW_BLOCK_DELAY = 4500;
const SHOW_FINAL_BLOCK_DELAY = 9000;

interface Props {
  birthDate: string;
  birthDateFromDB?: string;
  onButtonClick?: () => void;
  lifeExpectancy?: number;
}

export const InfoAfterBirthDate: FC<Props> = ({
  birthDate,
  birthDateFromDB,
  onButtonClick,
  lifeExpectancy,
}) => {
  const [showLifeExpectancy, setShowLifeExpectancy] = useState(false);
  const [showFinalBlock, setShowFinalBlock] = useState(false);

  const { t, i18n } = useTranslation();

  const isBirthDateFilled = !!birthDate;

  useEffect(() => {
    if (birthDateFromDB) {
      setShowLifeExpectancy(true);
      setShowFinalBlock(true);
      return;
    }
    if (isBirthDateFilled) {
      const timeout = setTimeout(() => setShowLifeExpectancy(true), SHOW_BLOCK_DELAY);
      const timeout2 = setTimeout(() => setShowFinalBlock(true), SHOW_FINAL_BLOCK_DELAY);
      return () => {
        clearTimeout(timeout);
        clearTimeout(timeout2);
      };
    } else {
      setShowLifeExpectancy(false);
      setShowFinalBlock(false);
    }
  }, [isBirthDateFilled, birthDateFromDB]);

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

  const isLongLiver = age >= DEFAULT_LIFE_SPAN_YEARS - 5;
  const expectancyWeeks = isLongLiver && lifeExpectancy ? Math.round(lifeExpectancy * 52.179) : 0;

  return (
    <>
      <div className={cx(s.resultText, { [s.visible]: isBirthDateFilled })}>
        {isBirthDateFilled && isLongLiver && t('life.birthDateDrawerLongLiverCongrats')}
      </div>
      <div className={cx(s.resultText, { [s.visible]: isBirthDateFilled })}>
        {isBirthDateFilled &&
          t('life.birthDateDrawerResult', {
            age,
            weekday: weekdayDisplay,
            yearsWord,
          })}
      </div>
      <div className={cx(s.statsText, { [s.visible]: isBirthDateFilled })}>
        {isBirthDateFilled && (
          <>
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
          </>
        )}
      </div>
      <div
        className={cx(s.statsText, s.lifeExpectancy, {
          [s.visible]: showLifeExpectancy,
          [s.noAnimation]: !!birthDateFromDB,
        })}
      >
        {isBirthDateFilled && t('life.birthDateDrawerLifeExpectancy')}
      </div>
      <div
        className={cx(s.statsText, s.finalBlock, {
          [s.visible]: showFinalBlock,
          [s.noAnimation]: !!birthDateFromDB,
        })}
      >
        {isBirthDateFilled && (
          <>
            {isLongLiver ? (
              <div>
                {t('life.birthDateDrawerLongLiverGoal', {
                  lifeExpectancy,
                  expectancyWeeks: expectancyWeeks,
                  weeksWord: getWeeksWord(expectancyWeeks, i18n.language),
                })}
              </div>
            ) : (
              <div>{t('life.birthDateDrawer90YearsSleep')}</div>
            )}
            {birthDate !== birthDateFromDB && (
              <Button onClick={onButtonClick} label={t('life.letsSee')} />
            )}
          </>
        )}
      </div>
    </>
  );
};
