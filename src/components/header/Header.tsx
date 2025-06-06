import { FC } from 'react';

import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { PATHS } from '@/constants/paths';
import { BurgerMenu } from '@/features';
import { useLifeMode } from '@/hooks';
import { useSyncPending } from '@/store/atoms';
import { AccountButton, SyncingLine } from '@/ui-kit';
import { getDepth } from '@/utils';

import { LifeActions } from './components/lifeActions';

import s from './s.module.styl';

export const Header: FC = () => {
  const { t } = useTranslation();
  const [pending] = useSyncPending();
  const { pathname } = useLocation();

  const [currentMode] = useLifeMode();
  const isLifePage = pathname === PATHS.MAIN;

  const pathSegments = pathname.split('/').filter(Boolean);
  const pageName = pathSegments[pathSegments.length - 1] || '';

  const showLC = isLifePage || !pageName;

  const currentDepth = getDepth(location.pathname);

  const title = `${showLC ? t('layout.shortLC') : ''} ${t(
    isLifePage ? `layout.${currentMode}` : `layout.${pageName}`,
  )}`;

  console.log('currentDepth', currentDepth);

  return (
    <div className={s.container}>
      <div className={s.header}>
        {pending && <SyncingLine />}
        <div className={s.leftSide}>
          <BurgerMenu backButton={currentDepth > 1} />
        </div>
        <span className={s.title}>{title}</span>
        <div className={s.rightSide}>{isLifePage ? <LifeActions /> : <AccountButton />}</div>
      </div>
    </div>
  );
};
