import { FC, ReactNode } from 'react';

import cx from 'classnames';

import { useOpenDrawerKey } from '@/store/atoms';
import { Button } from '@/ui-kit';

import s from './s.module.styl';

interface DrawerProps {
  keyProp: string;
  onClose: () => void;
  children?: ReactNode;
  closeButton?: boolean;
}

export const Drawer: FC<DrawerProps> = ({
  keyProp,
  onClose,
  children,
  closeButton = true,
}) => {
  const [drawerKey] = useOpenDrawerKey();
  const isOpen = drawerKey === keyProp;

  return (
    <>
      <div
        className={cx(s.drawerBlackout, { [s.hidden]: !isOpen })}
        onClick={onClose}
      />
      <div className={cx(s.drawerWrap, { [s.hidden]: !isOpen })}>
        <div className={s.drawerHeader}>
          {closeButton && <Button onClick={onClose} label="Close" />}
        </div>
        <div className={s.drawerContent}>{children}</div>
      </div>
    </>
  );
};
