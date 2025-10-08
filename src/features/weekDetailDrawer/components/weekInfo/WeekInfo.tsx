import { FC } from 'react';

import cx from 'classnames';

import { useTranslation, useZodiacIconSet } from '@/hooks';
import { SEASONS_ICONS } from '@/icons';
import { useLanguage } from '@/store/atoms';
import { IWeek } from '@/store/clientDB';
import { ESeason, TWeekZodiac } from '@/types';
import { checkEvenMonth, checkEvenSeason } from '@/utils';
import { getFemaleWordOrdinal, getYearsWordDative, getMonthsWord, getWereWord } from '@/utils';

import s from './s.module.styl';

type TProps = {
  week?: IWeek;
};

export const WeekInfo: FC<TProps> = ({ week }) => {
  const { t } = useTranslation();
  const [language] = useLanguage();

  const zodiacIconSet = useZodiacIconSet({ jsx: true, first: true });

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
    yearZodiacLabel,
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

  const ZodiacIcon = zodiacIconSet?.[yearZodiacLabel as TWeekZodiac];

  const SeasonIcon = SEASONS_ICONS?.[season as ESeason];
  const SecondSeasonIcon = SEASONS_ICONS?.[secondSeason as ESeason];

  return (
    <div className={s.wrapper}>
      <div className={cx(s.title, { [s.secondColor]: isEvenMonth })}>
        {isLeapYear && <div className={s.leapIcon}>leap</div>}
        {ZodiacIcon && <ZodiacIcon size={'14'} />}
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

      {seasonLabel && (
        <div className={s.seasons}>
          <span className={cx(s.seasonItem, { [s.secondColor]: isEvenSeason })}>
            {SeasonIcon && <SeasonIcon size={'14'} />}
            {seasonLabel}
          </span>
          {secondSeasonLabel && (
            <span className={cx(s.seasonItem, { [s.secondColor]: !isEvenSeason })}>
              <span className={s.separator}>/</span>
              {secondSeasonLabel}
              {SecondSeasonIcon && <SecondSeasonIcon size={'14'} />}
            </span>
          )}
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
