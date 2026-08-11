import { IWeek } from '@/store/clientDB';
import { ESeason, TDrawWeekIndexes } from '@/types';

type TUpdateSeasonWeekIndexesParams = {
  drawWeekIndexes: TDrawWeekIndexes;
  currentWeekIndex: number;
  season: ESeason;
  secondSeason: ESeason | null;
  month: string;
  year: string;
  media: string | null;
  previousWeek: IWeek | null;
};

/**
 * Winter spans Dec + Jan + Feb across a year boundary, so the whole block is
 * labelled by its December year: December keeps its own year, Jan/Feb roll back one.
 */
const getSeasonLabelYear = (season: ESeason, month: string, year: string): string => {
  if (season !== ESeason.Winter) return year;
  return month === '12' ? year : String(Number(year) - 1);
};

/**
 * Fills seasonsIndxs with per-week identity used by the seasons renderer. The
 * renderer groups consecutive weeks of the same primary season into one block and
 * lays them out in two rows around the block's "big" (season-preview) week, so
 * here we only need identity + block-start + boundary info, not row/col geometry.
 */
export const updateSeasonWeekIndexes = ({
  drawWeekIndexes,
  currentWeekIndex,
  season,
  secondSeason,
  month,
  year,
  media,
  previousWeek,
}: TUpdateSeasonWeekIndexesParams) => {
  if (!drawWeekIndexes?.seasonsIndxs || currentWeekIndex < 0) return;

  // A new block starts at birth or whenever the primary season changes. Winter
  // keeps flowing across Dec -> Jan (same season), so it stays a single block.
  const isStart = currentWeekIndex === 0 || previousWeek?.season !== season;

  drawWeekIndexes.seasonsIndxs[currentWeekIndex] = {
    season,
    secondSeason,
    year: getSeasonLabelYear(season, month, year),
    isStart,
    media,
  };
};
