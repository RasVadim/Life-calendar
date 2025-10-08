import { FC } from 'react';

import cx from 'classnames';

import { useTranslation } from '@/hooks';
import { useLanguage } from '@/store/atoms';
import { IWeek } from '@/store/clientDB';
import { checkEvenMonth, checkEvenSeason } from '@/utils';
import { getFemaleWordOrdinal, getYearsWordDative, getMonthsWord, getWereWord } from '@/utils';

import s from './s.module.styl';

type TProps = {
  week?: IWeek;
};

export const WeekInfo: FC<TProps> = ({ week }) => {
  const { t } = useTranslation();
  const [language] = useLanguage();

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
    index,
    lifeYear,
    lifeMonth,
  } = week || {};

  const monthLabel = t(`life.${month}`);
  const secondMonthLabel = secondMonth ? t(`life.${secondMonth}`) : '';
  const seasonLabel = season ? t(`life.${season}`) : '';
  const secondSeasonLabel = secondSeason ? t(`life.${secondSeason}`) : '';

  const dates = `${dateStart?.slice(8, 10)} - ${dateEnd?.slice(8, 10)}`;

  const isEvenMonth = checkEvenMonth(month);

  const isEvenSeason = checkEvenSeason(season);

  // Week number text
  const weekNumberText =
    index !== undefined && index !== null
      ? getFemaleWordOrdinal(index + 1, language || 'en') + ' ' + t('layout.weekOfLife')
      : '';

  // Age text
  const remainingMonths = lifeMonth ? lifeMonth % 12 : 0;
  const ageText =
    lifeYear !== undefined && lifeMonth !== undefined
      ? lifeYear === 1
        ? t('layout.youWereMonthsOld', {
            wasWord: getWereWord(lifeMonth, language || 'en'),
            months: lifeMonth,
            monthsWord: getMonthsWord(lifeMonth, language || 'en'),
          })
        : remainingMonths > 0
          ? t('layout.youWereYearsOld', {
              wasWord: getWereWord(lifeYear, language || 'en'),
              years: lifeYear - 1,
              yearsWord: getYearsWordDative(lifeYear - 1, language || 'en'),
              months: remainingMonths,
              monthsWord: getMonthsWord(remainingMonths, language || 'en'),
            })
          : t('layout.youWereYearsOldNoMonths', {
              wasWord: getWereWord(lifeYear, language || 'en'),
              years: lifeYear - 1,
              yearsWord: getYearsWordDative(lifeYear - 1, language || 'en'),
            })
      : '';

  const holidaysText = holidays?.map((holiday) => t(`life.holidays.${holiday}`)).join(', ');

  return (
    <div className={s.wrapper}>
      <div className={s.title}>
        {isLeapYear && <div className={s.leapIcon}>leap</div>}
        <div className={s.year}>{year}</div>
        <div className={cx(s.month, { [s.secondColor]: isEvenMonth })}>{monthLabel}</div>
        <div className={s.dates}>{dates}</div>
        {secondMonthLabel && (
          <div className={cx(s.month, { [s.secondColor]: !isEvenMonth })}>{secondMonthLabel}</div>
        )}
        {secondYear && <div className={s.year}>{secondYear}</div>}
      </div>

      <div className={s.weekNumber}>{weekNumberText}</div>
      <div className={s.age}>{ageText}</div>

      {(seasonLabel || secondSeasonLabel) && (
        <div className={s.seasons}>
          <div className={s.seasonItem}>
            <span className={cx(s.seasonValue, { [s.secondColor]: isEvenSeason })}>
              {seasonLabel}
            </span>
            {secondSeasonLabel && (
              <span className={cx(s.seasonValue, { [s.secondColor]: !isEvenSeason })}>
                / {secondSeasonLabel}
              </span>
            )}
          </div>
        </div>
      )}

      {holidaysText && (
        <div className={s.holidays}>
          <div className={s.holidaysList}>
            <span key={index} className={s.holidayItem}>
              {holidaysText}
            </span>
          </div>
        </div>
      )}

      {description && <div className={s.description}>{description}</div>}

      {comments && (
        <div className={s.comments}>
          <div className={s.commentsLabel}>{t('layout.comments')}:</div>
          <div className={s.commentsText}>{comments}</div>
        </div>
      )}
    </div>
  );
};
