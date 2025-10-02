import { TMedia, TMediaDatesMap } from '@/types';
import { formatDateToKey } from '@/utils';

/**
 * Sets a preview flag in the media object and returns the media key
 * @param weekStart - Start date of the week
 * @param media - Media map object to store preview flags (mutated)
 * @param previewType - Type of preview flag to set
 * @returns Date key in 'yyyyMMdd' format
 */
export const setPreviewFlag = (
  weekStart: Date,
  media: TMediaDatesMap<TMedia>,
  previewType: 'isMonthPreview' | 'isSeasonPreview',
): string => {
  const weekStartDate = formatDateToKey(weekStart);
  // Merge with existing flags instead of overwriting
  media[weekStartDate] = {
    ...media[weekStartDate],
    [previewType]: true,
  };
  return weekStartDate;
};

/**
 * Sets multiple preview flags in the media object
 * @param weekStart - Start date of the week
 * @param media - Media map object to store preview flags (mutated)
 * @param previewTypes - Array of preview flag types to set
 * @returns Date key in 'yyyyMMdd' format
 */
export const setMultiplePreviewFlags = (
  weekStart: Date,
  media: TMediaDatesMap<TMedia>,
  previewTypes: ('isMonthPreview' | 'isSeasonPreview' | 'isWeekPreview')[],
): string => {
  const weekStartDate = formatDateToKey(weekStart);

  // Merge with existing flags instead of overwriting
  const existingFlags = media[weekStartDate] || {};
  const newFlags = previewTypes.reduce((acc, type) => {
    acc![type] = true;
    return acc;
  }, {} as Partial<TMedia>);

  media[weekStartDate] = {
    ...existingFlags,
    ...newFlags,
  };

  return weekStartDate;
};
