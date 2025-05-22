import { useAtom, useSetAtom } from 'jotai';

import { openDrawerKeyAtom } from './atom';

export const useOpenDrawerKey = () => useAtom(openDrawerKeyAtom);
export const useSetOpenDrawerKey = () => useSetAtom(openDrawerKeyAtom);
