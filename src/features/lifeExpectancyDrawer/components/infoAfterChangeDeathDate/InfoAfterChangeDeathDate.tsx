import { FC, useState, useEffect } from 'react';

import cx from 'classnames';
import {
  differenceInYears,
  differenceInWeeks,
  parseISO,
  addYears,
  differenceInDays,
  differenceInMonths,
  addMonths,
} from 'date-fns';

import { DEFAULT_BIRTH_DATE } from '@/constants';
import { useTranslation } from '@/hooks';
import { Button } from '@/ui-kit';
import { getYearsWordDative, getWeeksWord, getMonthsWord, getRestDaysSentence } from '@/utils';

import s from './s.module.styl';

interface Props {
  birthDate: string;
  deathDate: string;
  lifeExpectancy: number;
  isDeathDateChanged: boolean;
  isLifeExpectancyRounded: boolean;
  onButtonClick?: () => void;
}

export const InfoAfterChangeDeathDate: FC<Props> = ({
  birthDate,
  deathDate,
  lifeExpectancy,
  onButtonClick,
  isDeathDateChanged,
  isLifeExpectancyRounded,
}) => {
  const { t, i18n } = useTranslation();

  // Parse birth date
  const birth = birthDate ? parseISO(birthDate) : parseISO(DEFAULT_BIRTH_DATE);

  // Determine death date
  let death;
  if (deathDate) {
    death = parseISO(deathDate);
  } else {
    death = addYears(birth, lifeExpectancy);
  }

  // Calculate difference
  const years = differenceInYears(death, birth);
  const afterYears = addYears(birth, years);
  const months = differenceInMonths(death, afterYears);
  const afterMonths = addMonths(afterYears, months);
  const days = differenceInDays(death, afterMonths);
  const weeks = differenceInWeeks(death, birth);

  const [show, setShow] = useState(true);
  const [contentKey, setContentKey] = useState(isLifeExpectancyRounded ? 'years' : 'date');

  useEffect(() => {
    setShow(false);
    const timeout = setTimeout(() => {
      setContentKey(isLifeExpectancyRounded ? 'years' : 'date');
      setShow(true);
    }, 300);
    return () => clearTimeout(timeout);
  }, [isLifeExpectancyRounded]);

  return (
    <div className={s.container}>
      <div className={cx(s.resultText, { [s.visible]: show })}>
        {contentKey === 'years'
          ? t('life.lifeExpectancyDrawerYearsResult', {
              lifeExpectancyYears: years,
              lifeExpectancyYearsWord: getYearsWordDative(years, i18n.language),
              weeks,
              weeksWord: getWeeksWord(weeks, i18n.language),
            })
          : t('life.lifeExpectancyDrawerDateResult', {
              lifeExpectancyYears: years,
              lifeExpectancyYearsWord: getYearsWordDative(years, i18n.language),
              lifeExpectancyMonths: months,
              lifeExpectancyMonthsWord: getMonthsWord(months, i18n.language),
              lifeExpectancyDaysString: getRestDaysSentence(days, i18n.language),
              weeks,
              weeksWord: getWeeksWord(weeks, i18n.language),
            })}
      </div>
      <div className={cx(s.finalBlock, { [s.visible]: isDeathDateChanged })}>
        {t('life.newLifeExpectancy')}
        {isDeathDateChanged && <Button onClick={onButtonClick} label={t('life.letsSee')} />}
      </div>
    </div>
  );
};
