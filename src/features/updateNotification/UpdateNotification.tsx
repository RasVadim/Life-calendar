import { FC, useState, useEffect } from 'react';

import { registerSW } from 'virtual:pwa-register';

import { useTranslation } from '@/hooks';
import { Button } from '@/ui-kit';

import s from './s.module.styl';

export const UpdateNotification: FC = () => {
  const { t } = useTranslation();

  const [needRefresh, setNeedRefresh] = useState(false);
  const [updateServiceWorker, setUpdateServiceWorker] = useState<() => void>();

  useEffect(() => {
    const updateSW = registerSW({
      onNeedRefresh() {
        setNeedRefresh(true);
        setUpdateServiceWorker(() => updateSW);
      },
    });
  }, []);

  if (!needRefresh || !updateServiceWorker) {
    return null;
  }

  return (
    <div className={s.wrapper}>
      <div className={s.content}>
        <p className={s.message}>{t('layout.newVersion')}</p>
        <Button onClick={updateServiceWorker} label={t('layout.update')} active />
      </div>
    </div>
  );
};
