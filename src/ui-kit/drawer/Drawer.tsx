import { FC, ReactNode, useEffect, useRef } from 'react';

import cx from 'classnames';

import { useTranslation } from '@/hooks';
import { useOpenDrawerKey } from '@/store/atoms';
import { EModalKeys } from '@/types';
import { Button } from '@/ui-kit';
import { changeByDrawerStatusBarColor, setStatusBarColor } from '@/utils';

import s from './s.module.styl';

interface DrawerProps {
  keyProp: EModalKeys;
  onClose: () => void;
  children?: ReactNode;
  closeButton?: boolean;
  actions?: ReactNode;
  topContent?: ReactNode;
  title?: string | ReactNode;
  disabledClose?: boolean;
  forceReRender?: boolean;
}

export const Drawer: FC<DrawerProps> = ({
  keyProp,
  onClose,
  children,
  closeButton = true,
  actions,
  topContent,
  title,
  disabledClose,
  forceReRender = false,
}) => {
  const [drawerKey] = useOpenDrawerKey();

  const previusStatusBarColor = useRef<string | undefined>('');

  const { t } = useTranslation();

  const isOpen = drawerKey === keyProp;

  useEffect(() => {
    if (isOpen) {
      previusStatusBarColor.current = changeByDrawerStatusBarColor();
    } else {
      setStatusBarColor({ color: previusStatusBarColor.current });
    }
  }, [isOpen]);

  const showContent = isOpen || forceReRender;

  return (
    <>
      <div
        className={cx(s.drawerBlackout, { [s.isOpen]: isOpen })}
        onClick={disabledClose ? undefined : onClose}
      />
      <div className={cx(s.drawerWrap, { [s.hidden]: !isOpen })}>
        <div className={cx(s.drawerHeader, { [s.noPaddings]: !closeButton || topContent })}>
          {closeButton && (
            <Button
              onClick={onClose}
              label={t('layout.close')}
              disabled={disabledClose}
              className={s.closeButton}
            />
          )}
          {actions ?? actions}
        </div>
        <div className={cx(s.drawerScrollableContent, { [s.borderRadius]: !!topContent })}>
          {title && <div className={s.drawerTitle}>{title}</div>}
          {topContent ?? topContent}
          <div className={s.drawerContent}>{showContent && children}</div>
        </div>
      </div>
    </>
  );
};
