import { IDrawWeekIndexes } from '@/store/clientDB';

export type TWeekIndxsMap<T = string> = { [k: number]: T };

export enum EYearsWeekIndxsValues {
  Half = 'half',
  HalfLeap = 'halfLeap',
  FullFirst = 'fullFirst',
}

export enum ESegmentsWeekIndxsValues {
  First = 'first',
  FirstPreview = 'firstPreview',
  Preview = 'preview',
  Split = 'split',
  SplitPreview = 'splitPreview',
}

export type TDrawWeekIndexes = Omit<IDrawWeekIndexes, 'id'>;
