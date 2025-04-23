import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { AccountButton, SyncingLine } from '@/ui-kit';
import { useSyncPending } from '@/store/atoms';
import { useLifeMode } from '@/hooks';

import { BurgerMenu } from '../burgeMenu/BurgerMenu';
import s from './s.module.styl';

export const Header: FC = () => {
  const { t } = useTranslation();
  const [pending] = useSyncPending();

  const currentMode = useLifeMode();

  return (
    <div className={s.container}>
      <div className={s.header}>
        {pending && <SyncingLine />}
        <BurgerMenu />
        {`${t('layout.shortLC')} ${t(`layout.${currentMode}`)}`}
        <AccountButton />
      </div>
    </div>
  );
};
