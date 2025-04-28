import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { AccountButton, SyncingLine } from '@/ui-kit';
import { useSyncPending } from '@/store/atoms';
import { useLifeMode } from '@/hooks';
import { PATHS } from '@/constants/paths';

import { BurgerMenu } from '../burgeMenu/BurgerMenu';
import { LifeActions } from './components/lifeActions';
import s from './s.module.styl';

export const Header: FC = () => {
  const { t } = useTranslation();
  const [pending] = useSyncPending();
  const { pathname } = useLocation();

  const [currentMode] = useLifeMode();
  const isLifePage = pathname === PATHS.MAIN;

  return (
    <div className={s.container}>
      <div className={s.header}>
        {pending && <SyncingLine />}
        <div className={s.leftSide}>
          <BurgerMenu />
        </div>
        <span className={s.title}>{`${t('layout.shortLC')} ${t(`layout.${currentMode}`)}`}</span>
        <div className={s.rightSide}>
          {isLifePage ? <LifeActions /> : <AccountButton />}
        </div>
      </div>
    </div>
  );
};
