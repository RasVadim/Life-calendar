import { useMemo } from 'react';

import { useTranslation } from '@/hooks';
import { useLanguage } from '@/store/atoms';
import { getFemaleWordOrdinal, getYearsWordDative, getMonthsWord, getWillWord } from '@/utils';

type TUseAgeTextParams = {
  lifeYear?: number;
  lifeMonth?: number;
  weekIndex?: number;
  dateStart?: string;
};

export const useAgeText = ({ lifeYear, lifeMonth, weekIndex, dateStart }: TUseAgeTextParams) => {
  const [language] = useLanguage();
  const { t } = useTranslation();

  const weekNumberText = useMemo(() => {
    if (weekIndex === undefined || weekIndex === null) return '';
    return getFemaleWordOrdinal(weekIndex + 1, language || 'en');
  }, [weekIndex, language]);

  const ageText = useMemo((): string | null => {
    if (lifeYear === undefined || lifeMonth === undefined) return null;

    // Check if this is a future date
    const isFuture = dateStart ? new Date(dateStart) > new Date() : false;

    // lifeMonth is the current month number, so passed months = lifeMonth - 1
    const fullMonths = lifeMonth - 1;
    const fullYears = lifeYear - 1;
    const remainingMonths = fullMonths % 12;

    // Check if user is less than 1 month old
    if (fullMonths < 1) {
      return t('life.lessThanMonth');
    }

    const willWord = getWillWord(isFuture, language || 'en');

    if (lifeYear === 1) {
      const monthsWord = getMonthsWord(fullMonths, language || 'en');
      return t('life.youWereMonthsOld', { willWord, months: fullMonths, monthsWord });
    }

    if (remainingMonths > 0) {
      const yearsWord = getYearsWordDative(fullYears, language || 'en');
      const monthsWord = getMonthsWord(remainingMonths, language || 'en');
      return t('life.youWereYearsOld', {
        willWord,
        years: fullYears,
        yearsWord,
        months: remainingMonths,
        monthsWord,
      });
    }

    const yearsWord = getYearsWordDative(fullYears, language || 'en');
    return t('life.youWereYearsOldNoMonths', { willWord, years: fullYears, yearsWord });
  }, [lifeYear, lifeMonth, dateStart, language, t]);

  return {
    weekNumberText,
    ageText,
  };
};
