import { FC } from 'react';

import { ProfileSettings } from '@/components';

import s from './s.module.styl';

export const Content: FC = () => {
  return (
    <div className={s.content}>
      <ProfileSettings />
    </div>
  );
};

export default Content;
