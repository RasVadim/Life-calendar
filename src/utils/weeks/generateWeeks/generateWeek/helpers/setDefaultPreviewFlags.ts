import { format } from 'date-fns';

import { IWeek } from '@/store/clientDB';
import { ESeason, TMedia, TMediaDatesMap } from '@/types';

type TSetDefaultPreviewFlagsParams = {
  weekStart: Date;
  previousWeek: IWeek | null;
  currentMonth: string;
  currentSeason: ESeason;
  isWeekStartMonday: boolean;
  media: TMediaDatesMap<TMedia>;
};

/**
 * Helper function to set preview flag and return media key
 */
const setPreviewFlag = (
  weekStart: Date,
  media: TMediaDatesMap<TMedia>,
  previewType: 'isMonthPreview' | 'isSeasonPreview',
): string => {
  const weekStartDate = format(weekStart, 'yyyyMMdd');
  // Merge with existing flags instead of overwriting
  media[weekStartDate] = {
    ...media[weekStartDate],
    [previewType]: true,
  };
  return weekStartDate;
};

/**
 * Sets default preview flags in the media object and returns the media key if preview is needed.
 *
 * @param params - Parameters object
 * @param params.weekStart - Start date of the current week
 * @param params.previousWeek - Previous week object for comparison, null for first week
 * @param params.currentMonth - Current week's month in "MM" format (e.g., "03")
 * @param params.currentSeason - Current week's season enum value
 * @param params.isWeekStartMonday - Whether current week starts on Monday
 * @param params.media - Media map object to store preview flags (mutated)
 * @returns Date key in 'yyyyMMdd' format if preview is set, null otherwise
 */
export const setDefaultPreviewFlags = ({
  weekStart,
  previousWeek,
  currentMonth,
  currentSeason,
  isWeekStartMonday,
  media,
}: TSetDefaultPreviewFlagsParams): string | null => {
  // For the first week of life, set both month and season preview
  if (!previousWeek) {
    setPreviewFlag(weekStart, media, 'isSeasonPreview');
    return setPreviewFlag(weekStart, media, 'isMonthPreview');
  }

  if (!!previousWeek?.secondMonth || (previousWeek?.month !== currentMonth && isWeekStartMonday)) {
    return setPreviewFlag(weekStart, media, 'isMonthPreview');
  }

  if (
    !!previousWeek?.secondSeason ||
    (previousWeek?.season !== currentSeason && isWeekStartMonday)
  ) {
    return setPreviewFlag(weekStart, media, 'isSeasonPreview');
  }

  return null;
};
