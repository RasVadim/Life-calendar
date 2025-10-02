import { EDayOfWeek, TMedia } from '@/types';

export type TMediaItem = {
  dayOfWeek: EDayOfWeek;
  mediaIndex: string | null;
  weekIndex?: number;
  dayIndex: number;
} & Partial<TMedia>;
