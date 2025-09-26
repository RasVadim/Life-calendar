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

export enum EMonthsEndsIndxsValues {
  FullBorder = 'fullBorder',
  HalfBorder = 'halfBorder',
  Full = 'full',
  Half = 'half',
  FullBorderEnd = 'fullBorderEnd',
  HalfBorderEnd = 'halfBorderEnd',
}

export type TMedia = {
  url?: string;
  localPath?: string;
  isWeekPreview?: boolean;
  isSeasonPreview?: boolean;
  isMonthPreview?: boolean;
  isVideo?: boolean;
  source?: 'LC' | 'Instagram' | 'Telegram' | 'Other';
  // days?: Omit<TMedia, 'days'>[];
} | null;

export type TMonthsIndxsValue = {
  type: EMonthsWeekIndxsValues | EMonthsEndsIndxsValues;
  media?: string;
  month?: string;
  year?: string;
} | null;

export type TDrawWeekIndexes = Omit<IDrawWeekIndexes, 'id'>;

export enum ESide {
  Left = 'left',
  Right = 'right',
}
