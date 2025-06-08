import { FC } from 'react';

import { Settings } from '@/components';

import s from './s.module.styl';

export const MainSettingsScreen: FC = () => {
  return (
    <div className={s.content}>
      <Settings />
    </div>
  );
};
