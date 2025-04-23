import { useEffect, useState } from 'react';
import { useLifeGridColumnsCount } from '@/store/atoms';
import { LIFE_GRID_ZOOM_LEVELS, LIFE_MODES } from '@/constants';

type TLifeMode = (typeof LIFE_MODES)[keyof typeof LIFE_MODES];

const ZOOM_MODE_MAP = Object.fromEntries(
  Object.entries(LIFE_GRID_ZOOM_LEVELS).map(([key, value]) => [
    value.toString(),
    key,
  ])
);

export const useLifeMode = (): TLifeMode => {
  const [columns] = useLifeGridColumnsCount();
  const [mode, setMode] = useState<TLifeMode>(
    ZOOM_MODE_MAP[columns] ?? LIFE_MODES.YEARS
  );

  useEffect(() => {
    if (ZOOM_MODE_MAP[columns] && mode !== ZOOM_MODE_MAP[columns]) {
      setMode(ZOOM_MODE_MAP[columns]);
    }
  }, [columns]);

  return mode;
};
