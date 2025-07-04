import { useAtom, useSetAtom } from 'jotai';

import { ZoomCentralWeek } from './atom';

export const useZoomCentralWeek = () => useAtom(ZoomCentralWeek);

export const useSetZoomCentralWeek = () => useSetAtom(ZoomCentralWeek);
