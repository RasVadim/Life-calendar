import { useAtom, useSetAtom } from 'jotai';

import { fullscreenMediaAtom } from './atom';

export const useFullscreenViewer = () => useAtom(fullscreenMediaAtom);

export const useSetFullscreenViewer = () => useSetAtom(fullscreenMediaAtom);
