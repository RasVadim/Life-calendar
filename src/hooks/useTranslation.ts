import { useTranslation as useI18nTranslation } from 'react-i18next';

import { useLanguage } from '@/store/atoms';

export const useTranslation = () => {
  const { t, i18n: i18nInstance } = useI18nTranslation();
  const [language] = useLanguage();

  // Custom t function that returns empty string if language is not set
  const safeT = (key: string, options?: Record<string, unknown>): string => {
    if (!!language && i18nInstance.language !== language) {
      return ' ... ';
    }
    return String(t(key, options));
  };

  return {
    t: safeT,
    i18n: i18nInstance,
    isInitialized: i18nInstance.isInitialized,
  };
};
