import { useAtom, useSetAtom } from 'jotai';

import { Notification } from './atom';

export const useNotification = () => useAtom(Notification);

export const useSetNotification = () => useSetAtom(Notification);
