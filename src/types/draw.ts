import { IDrawWeekIndexes } from '@/store/clientDB';

import { ESeason } from './life';

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

// Per-week data for seasons mode. Unlike months (where flags drive row breaks),
// the seasons renderer groups weeks into blocks and lays out a 2-row grid around
// the "big" (season-preview) week, so here we store identity + boundary info.
export type TSeasonsIndxsValue = {
  season: ESeason;
  secondSeason: ESeason | null; // set when the week straddles two seasons (mid-week border)
  year: string; // winter-aware label year (Dec belongs to its own year, Jan/Feb to the prev)
  isStart: boolean; // first week of the season block
  media?: string | null; // media key; the block's big week is the one flagged isSeasonPreview
} | null;

export type TDrawWeekIndexes = Omit<IDrawWeekIndexes, 'id'>;

export enum ESide {
  Left = 'left',
  Right = 'right',
}
