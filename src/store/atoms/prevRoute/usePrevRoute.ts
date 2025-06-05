import { useAtom, useSetAtom } from 'jotai';

import { PrevRoute } from './atom';

export const usePrevRoute = () => useAtom(PrevRoute);

export const useSetPrevRoute = () => useSetAtom(PrevRoute);
