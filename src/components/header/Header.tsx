import { FC } from 'react';

import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { PATHS } from '@/constants/paths';
import { BurgerMenu } from '@/features';
import { useLifeMode } from '@/hooks';
import { useSyncPending } from '@/store/atoms';
import { AccountButton, SyncingLine } from '@/ui-kit';

import { LifeActions } from './components/lifeActions';

import s from './s.module.styl';

export const Header: FC = () => {
  const { t } = useTranslation();
  const [pending] = useSyncPending();
  const { pathname } = useLocation();

  const [currentMode] = useLifeMode();
  const isLifePage = pathname === PATHS.MAIN;

  const pageName = pathname.split('/')[1];

  return (
    <div className={s.container}>
      <div className={s.header}>
        {pending && <SyncingLine />}
        <div className={s.leftSide}>
          <BurgerMenu />
        </div>
        <span className={s.title}>{`${t('layout.shortLC')} ${t(
          isLifePage ? `layout.${currentMode}` : `layout.${pageName}`,
        )}`}</span>
        <div className={s.rightSide}>
          {isLifePage ? <LifeActions /> : <AccountButton />}
        </div>
      </div>
    </div>
  );
};
