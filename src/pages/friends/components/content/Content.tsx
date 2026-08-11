import { FC } from 'react';

import { useTranslation } from '@/hooks';

import s from './s.module.styl';

export const Content: FC = () => {
  const { t } = useTranslation();

  return (
    <div className={s.content}>
      <div className={s.placeholder}>
        <div className={s.title}>{t('layout.pageInDevelopmentTitle')}</div>
        <div className={s.text}>{t('layout.pageInDevelopment')}</div>
      </div>
    </div>
  );
};

export default Content;
