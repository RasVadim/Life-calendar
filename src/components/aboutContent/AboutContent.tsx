import React, { FC } from 'react';

import { useTranslation } from '@/hooks';

import s from './s.module.styl';

export const AboutContent: FC = () => {
  const { t } = useTranslation();
  return <div className={s.wrapper}>{t('layout.about')}</div>;
};
