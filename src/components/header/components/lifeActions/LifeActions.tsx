import { FC } from 'react';

import { Button } from '@/ui-kit';
import { useLifeMode } from '@/hooks';
import { LIFE_MODES } from '@/constants';
import type { TLifeMode } from '@/hooks/useLifeMode/useLifeMode';

import s from './s.module.styl';

export const LifeActions: FC = () => {
  const [currentMode, setMode] = useLifeMode();

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
