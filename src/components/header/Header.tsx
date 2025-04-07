import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { AccountButton, SyncingLine } from '@/ui-kit';
import { useSyncPending } from '@/store/atoms';

import { BurgerMenu } from '../burgeMenu/BurgerMenu';
import s from './s.module.styl';

export const Header: FC = () => {
  const { t } = useTranslation();
  const [pending] = useSyncPending();

  return (
    <div className={s.container}>
      <div className={s.header}>
        {pending && <SyncingLine />}
        <BurgerMenu />
        {t('layout.lifeCalendar')}
        <AccountButton />
      </div>
    </div>
  );
};
