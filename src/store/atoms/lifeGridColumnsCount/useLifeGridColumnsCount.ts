import { useAtom, useSetAtom } from 'jotai';

import { LifeGridColumnsCount } from './atom';

export const useLifeGridColumnsCount = () => useAtom(LifeGridColumnsCount);

export const useSetLifeGridColumnsCount = () => useSetAtom(LifeGridColumnsCount);
