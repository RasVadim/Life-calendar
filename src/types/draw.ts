import { IDrawWeekIndexes } from '@/store/clientDB';

export type TWeekIndxsMap<T = string> = { [k: number]: T };
export type TMediaDatesMap<T = object> = { [k: string]: T };

export enum EYearsWeekIndxsValues {
  Half = 'half',
  HalfLeap = 'halfLeap',
  FullFirst = 'fullFirst',
}

export enum ESegmentsWeekIndxsValues {
  Border = 'border',
  BorderEnd = 'borderEnd',
  First4 = 'first4',
  First5 = 'first5',
  FirstFull4 = 'firstFull4',
  FirstFull5 = 'firstFull5',
}

export enum EMonthsWeekIndxsValues {
  Border = 'border',
  BorderEnd = 'borderEnd',
  First4 = 'first4',
  First5 = 'first5',
  FirstFull4 = 'firstFull4',
  FirstFull5 = 'firstFull5',
}

export type TMediasWeekIndxsValues = {
  url?: string;
  localPath?: string;
  isSeasonPreview?: boolean;
  isMonthPreview?: boolean;
  isVideo?: boolean;
  source?: 'LC' | 'Instagram' | 'Telegram' | 'Other';
  // days?: Omit<TMediasWeekIndxsValues, 'days'>[];
} | null;

export type TDrawWeekIndexes = Omit<IDrawWeekIndexes, 'id'>;

export enum ESide {
  Left = 'left',
  Right = 'right',
}
