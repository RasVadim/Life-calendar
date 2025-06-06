import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import s from './s.module.styl';

export const Content: FC = () => {
  const { t } = useTranslation();
  return (
    <div className={s.content}>
      {t('layout.dataAndStorage')}
    </div>
  );
};

export default Content;
