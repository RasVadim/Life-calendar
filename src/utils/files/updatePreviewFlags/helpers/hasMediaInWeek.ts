import { TMedia, TMediaDatesMap, TDay } from '@/types';

import { validateMedia } from './validateMedia';

/**
 * Checks if a week has any media (excluding the current dateKey)
 */
export const hasMediaInWeek = (
  days: TDay[],
  mediaMap: TMediaDatesMap<TMedia>,
  dateKey: string,
): boolean => {
  return days
    .filter((day) => day.media)
    .some((day) => {
      const validation = validateMedia(mediaMap[day.media!], dateKey);
      return validation.hasFileId;
    });
};
