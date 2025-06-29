import { FC } from 'react';

import { LIFE_MODES } from '@/constants';
import { useLifeGridMode } from '@/store/atoms';
import type { TLifeMode } from '@/types';
import { Button } from '@/ui-kit';

import s from './s.module.styl';

export const LifeActions: FC = () => {
  const [currentMode, setMode] = useLifeGridMode();

  return (
    <div className={s.container}>
      {(Object.values(LIFE_MODES) as TLifeMode[]).map((mode) => (
        <Button
          key={mode}
          onClick={() => setMode(mode)}
          icon={mode}
          active={currentMode === mode}
          gost={currentMode !== mode}
          size="small"
          onlyIcon
        />
      ))}
    </div>
  );
};
