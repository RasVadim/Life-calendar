import { FC, PropsWithChildren } from 'react';

import s from './s.module.styl';

export const SettingsSubScreenWrap: FC<PropsWithChildren> = ({ children }) => {
  return <div className={s.content}>{children}</div>;
};
