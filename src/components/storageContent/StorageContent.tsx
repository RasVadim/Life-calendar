import React, { FC } from 'react';

import { useTranslation } from '@/hooks';

import s from './s.module.styl';

export const StorageContent: FC = () => {
  const { t } = useTranslation();
  return <div className={s.wrapper}>{t('layout.dataAndStorage')}</div>;
};
