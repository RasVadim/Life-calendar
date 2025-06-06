import { FC } from 'react';

import { ProfileSettings } from '@/components';

import s from './s.module.styl';

export const MainSettingsScreen: FC = () => {
  return (
    <div className={s.content}>
      <ProfileSettings />
    </div>
  );
};
