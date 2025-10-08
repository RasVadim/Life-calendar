import { useMemo } from 'react';

import { useLanguage } from '@/store/atoms';
import { getFemaleWordOrdinal, getYearsWordDative, getMonthsWord, getWereWord } from '@/utils';

export enum EAgeTextType {
  Months = 'months',
  YearsWithMonths = 'yearsWithMonths',
  YearsOnly = 'yearsOnly',
}

type TUseAgeTextParams = {
  lifeYear?: number;
  lifeMonth?: number;
  weekIndex?: number;
};

type TAgeTextResult =
  | {
      type: EAgeTextType.Months;
      wasWord: string;
      months: number;
      monthsWord: string;
    }
  | {
      type: EAgeTextType.YearsWithMonths;
      wasWord: string;
      years: number;
      yearsWord: string;
      months: number;
      monthsWord: string;
    }
  | {
      type: EAgeTextType.YearsOnly;
      wasWord: string;
      years: number;
      yearsWord: string;
    }
  | null;

export const useAgeText = ({ lifeYear, lifeMonth, weekIndex }: TUseAgeTextParams) => {
  const [language] = useLanguage();

  const weekNumberText = useMemo(() => {
    if (weekIndex === undefined || weekIndex === null) return '';
    return getFemaleWordOrdinal(weekIndex + 1, language || 'en');
  }, [weekIndex, language]);

  const ageText = useMemo((): TAgeTextResult => {
    if (lifeYear === undefined || lifeMonth === undefined) return null;

    const remainingMonths = lifeMonth % 12;

    if (lifeYear === 1) {
      return {
        wasWord: getWereWord(lifeMonth, language || 'en'),
        months: lifeMonth,
        monthsWord: getMonthsWord(lifeMonth, language || 'en'),
        type: EAgeTextType.Months,
      };
    }

    if (remainingMonths > 0) {
      return {
        wasWord: getWereWord(lifeYear, language || 'en'),
        years: lifeYear - 1,
        yearsWord: getYearsWordDative(lifeYear - 1, language || 'en'),
        months: remainingMonths,
        monthsWord: getMonthsWord(remainingMonths, language || 'en'),
        type: EAgeTextType.YearsWithMonths,
      };
    }

    return {
      wasWord: getWereWord(lifeYear, language || 'en'),
      years: lifeYear - 1,
      yearsWord: getYearsWordDative(lifeYear - 1, language || 'en'),
      type: EAgeTextType.YearsOnly,
    };
  }, [lifeYear, lifeMonth, language]);

  return {
    weekNumberText,
    ageText,
  };
};
