import { useAtom, useSetAtom } from 'jotai';

import { LifeGridMode } from './atom';

export const useLifeGridMode = () => useAtom(LifeGridMode);

export const useSetLifeGridMode = () => useSetAtom(LifeGridMode);
