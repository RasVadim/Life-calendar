import { FC, ReactNode } from 'react';

import cx from 'classnames';
import { useTranslation } from 'react-i18next';

import { useOpenDrawerKey } from '@/store/atoms';
import { Button } from '@/ui-kit';

import s from './s.module.styl';

interface DrawerProps {
  keyProp: string;
  onClose: () => void;
  children?: ReactNode;
  closeButton?: boolean;
  actions?: ReactNode;
  title?: string | ReactNode;
  disabledClose?: boolean;
}

export const Drawer: FC<DrawerProps> = ({
  keyProp,
  onClose,
  children,
  closeButton = true,
  actions,
  title,
  disabledClose,
}) => {
  const [drawerKey] = useOpenDrawerKey();

  const { t } = useTranslation();

  const isOpen = drawerKey === keyProp;

  return (
    <>
      <div
        className={cx(s.drawerBlackout, { [s.hidden]: !isOpen })}
        onClick={disabledClose ? undefined : onClose}
      />
      <div className={cx(s.drawerWrap, { [s.hidden]: !isOpen })}>
        <div className={s.drawerHeader}>
          {closeButton && (
            <Button
              onClick={onClose}
              label={t('layout.close')}
              disabled={disabledClose}
            />
          )}
          {actions ?? actions}
        </div>
        {title && <div className={s.drawerTitle}>{title}</div>}
        <div className={s.drawerContent}>{children}</div>
      </div>
    </>
  );
};
