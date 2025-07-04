import { FC } from 'react';

import s from './s.module.styl';

export const SyncingLine: FC = () => {
  return (
    <div className={s.wrap}>
      <div className={s.bar}></div>
    </div>
  );
};
