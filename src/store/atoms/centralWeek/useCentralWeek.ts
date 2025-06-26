import { useAtom, useSetAtom } from 'jotai';

import { CentralWeek } from './atom';

export const useCentralWeek = () => useAtom(CentralWeek);

export const useSetCentralWeek = () => useSetAtom(CentralWeek);
