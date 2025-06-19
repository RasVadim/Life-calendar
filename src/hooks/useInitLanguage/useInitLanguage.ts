import { useEffect } from 'react';

import i18n from 'i18next';

import { TLanguage, useLanguage, useSetSyncPending } from '@/store/atoms';

export function useInitLanguage() {
  const [language, setLanguage] = useLanguage();
  const setPending = useSetSyncPending();

  console.log('language', language);
  useEffect(() => {
    if (!language) {
      // Only set browser language if no language is set in atom
      const browserLang = navigator.language.split('-')[0];
      const supportedLangs = ['en', 'ru'];
      const langToSet = supportedLangs.includes(browserLang) ? browserLang : 'en';

      i18n.changeLanguage(langToSet).then(() => {
        setPending(false);
      });
      setLanguage(langToSet as TLanguage);
    } else {
      // Set language from atom (user's choice or restored from storage)
      i18n.changeLanguage(language).then(() => {
        setPending(false);
      });
    }
  }, [language]);
}
