import { FC, ReactNode } from 'react';

import cx from 'classnames';

import { CloseIcon } from '@/icons';
import { Button } from '@/ui-kit';

import s from './s.module.styl';

type TProps = {
  message: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  children?: ReactNode;
  className?: string;
  autoHide?: boolean;
  closable?: boolean;
  onClose?: () => void;
};

export const Notification: FC<TProps> = ({
  message,
  buttonLabel,
  onButtonClick,
  children,
  className,
  autoHide = false,
  closable = false,
  onClose,
}) => {
  return (
    <div className={`${s.wrapper} ${className || ''}`}>
      <div className={cx(s.content, { [s.autoHide]: autoHide })}>
        {closable && (
          <Button
            className={s.closeButton}
            onClick={onClose}
            onlyIcon
            gost
            size="large"
            icon={<CloseIcon />}
          />
        )}
        <p className={cx(s.message, { [s.marginLeft]: closable })}>{message}</p>
        {children}
        {buttonLabel && <Button onClick={onButtonClick} label={buttonLabel} active />}
      </div>
    </div>
  );
};
