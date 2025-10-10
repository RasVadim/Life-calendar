import { FC } from 'react';

import { useDevice } from '@/hooks';

import s from './s.module.styl';

type TProps = {
  hint?: string;
};

export const Hint: FC<TProps> = ({ hint = 'Swipe down or tap to close' }) => {
  const { isMedium } = useDevice();

  if (!isMedium) {
    return null;
  }

  return <div className={s.closeHint}>{hint}</div>;
};
