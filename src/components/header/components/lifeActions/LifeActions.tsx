import { FC } from 'react';

import { useLifeGridMode } from '@/store/atoms';
import { ELifeMode } from '@/types';
import { Button } from '@/ui-kit';

import s from './s.module.styl';

export const LifeActions: FC = () => {
  const [currentMode, setMode] = useLifeGridMode();

  return (
    <div className={s.container}>
      {Object.values(ELifeMode).map((mode) => (
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
