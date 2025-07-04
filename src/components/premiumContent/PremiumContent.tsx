import React, { FC } from 'react';

import { useTranslation } from '@/hooks';

import s from './s.module.styl';

export const PremiumContent: FC = () => {
  const { t } = useTranslation();
  return <div className={s.wrapper}>{t('layout.lcPremium')}</div>;
};
