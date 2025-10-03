import { TMedia, TMediaDatesMap, TDay } from '@/types';

/**
 * Clears specific preview flags from days
 * Merges with existing updates to avoid overwriting previous changes
 */
export const clearPreviewFlags = (
  days: TDay[],
  mediaMap: TMediaDatesMap<TMedia>,
  previewType: 'isWeekPreview' | 'isMonthPreview' | 'isSeasonPreview',
  updates: TMediaDatesMap<TMedia>,
) => {
  days
    .filter((day) => day.media)
    .forEach((day) => {
      const media = mediaMap[day.media!];
      mediaMap[day.media!];
      if (media && previewType in media && media[previewType]) {
        const existingUpdate = updates[day.media!] || media;

        // Merge existing updates with new change
        updates[day.media!] = {
          ...existingUpdate,
          [previewType]: false,
        };
      }
    });
};
