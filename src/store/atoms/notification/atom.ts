import { atom } from 'jotai';

import { TNotification } from '@/types';

export const Notification = atom<TNotification | null>(null);
