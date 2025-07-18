import { FC } from 'react';

import cx from 'classnames';
import { useLocation } from 'react-router-dom';

import { PATHS } from '@/constants/paths';
import { BurgerMenu } from '@/features';
import { useTranslation } from '@/hooks';
import { useLifeGridMode, useSyncPending } from '@/store/atoms';
import { AccountButton, SyncingLine } from '@/ui-kit';
import { getDepth } from '@/utils';

import { LifeActions } from './components/lifeActions';

import s from './s.module.styl';

type TProps = {
  preview?: boolean;
};

export const Header: FC<TProps> = ({ preview = false }) => {
  const { t } = useTranslation();
  const [pending] = useSyncPending();
  const { pathname } = useLocation();

  const [currentMode] = useLifeGridMode();
  const isLifePage = [PATHS.MAIN, PATHS.FRIENDS].includes(pathname);

  const pathSegments = pathname.split('/').filter(Boolean);
  const pageName = pathSegments[pathSegments.length - 1] || '';

  const showLC = isLifePage || !pageName;

  const currentDepth = getDepth(location.pathname);

  const title = `${showLC ? t('layout.shortLC') : ''} ${t(
    isLifePage ? `layout.${currentMode}` : `layout.${pageName}`,
  )}`;

  return (
    <div className={cx(s.container, { [s.preview]: preview })}>
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
