import { FC, ReactNode } from 'react';

import { Button } from '@/ui-kit';

import s from './s.module.styl';

type TProps = {
  message: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  children?: ReactNode;
  className?: string;
  autoHide?: boolean;
};

export const Notification: FC<TProps> = ({
  message,
  buttonLabel,
  onButtonClick,
  children,
  className,
  autoHide = false,
}) => {
  return (
    <div className={`${s.wrapper} ${className || ''}`}>
      <div className={`${s.content} ${autoHide ? s.autoHide : ''}`}>
        <p className={s.message}>{message}</p>
        {children}
        {buttonLabel && <Button onClick={onButtonClick} label={buttonLabel} active />}
      </div>
    </div>
  );
};
