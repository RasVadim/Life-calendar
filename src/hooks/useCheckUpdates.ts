import { useEffect } from 'react';

import { registerSW } from 'virtual:pwa-register';

import { useTranslation, useNotifications } from '@/hooks';

export const useCheckUpdates = () => {
  const { t } = useTranslation();
  const { showNotification } = useNotifications();

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        showNotification({
          message: t('layout.newVersion'),
          buttonLabel: t('layout.update'),
          onButtonClick: updateSW,
        });
      },
    });
  }, []);
};
