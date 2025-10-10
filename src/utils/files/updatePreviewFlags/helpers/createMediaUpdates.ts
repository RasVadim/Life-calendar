import { IWeek, updateDBWeek } from '@/store/clientDB';
import { TMedia, TMediaDatesMap } from '@/types';

import { clearPreviewFlags } from './clearPreviewFlags';

type CreateMediaUpdatesParams = {
  dateKey: string;
  dayIndex: number;
  currentWeek: IWeek;
  weeksInMonth: IWeek[];
  weeksInSeason: IWeek[];
  mediaMap: TMediaDatesMap<TMedia>;
  monthHasMedia: boolean;
  seasonHasMedia: boolean;
};

type MediaUpdatesResult = {
  mediaUpdates: TMediaDatesMap<TMedia>;
  weekUpdatePromise: Promise<void> | null;
};

/**
 * Creates media updates for week, month, and season preview flags
 */
export const createMediaUpdates = ({
  dateKey,
  dayIndex,
  currentWeek,
  weeksInMonth,
  weeksInSeason,
  mediaMap,
  monthHasMedia,
  seasonHasMedia,
}: CreateMediaUpdatesParams): MediaUpdatesResult => {
  const mediaUpdates: TMediaDatesMap<TMedia> = {};
  let weekUpdatePromise: Promise<void> | null = null;

  // Set week preview (assuming weekHasMedia check is done in main function)
  clearPreviewFlags(currentWeek.days, mediaMap, 'isWeekPreview', mediaUpdates);
  mediaUpdates[dateKey] = { ...mediaMap[dateKey], isWeekPreview: true };
  const updatedDays = [...currentWeek.days];
  if (updatedDays[dayIndex]) {
    updatedDays[dayIndex] = { ...updatedDays[dayIndex], media: dateKey };
  }
  weekUpdatePromise = updateDBWeek({ ...currentWeek, days: updatedDays });

  // Set month preview if month has no media
  if (!monthHasMedia) {
    weeksInMonth.forEach((week) =>
      clearPreviewFlags(week.days, mediaMap, 'isMonthPreview', mediaUpdates),
    );
    const existingBase = mediaUpdates[dateKey] || mediaMap[dateKey];
    mediaUpdates[dateKey] = { ...existingBase, isMonthPreview: true };
  }

  // Set season preview if season has no media
  if (!seasonHasMedia) {
    weeksInSeason.forEach((week) =>
      clearPreviewFlags(week.days, mediaMap, 'isSeasonPreview', mediaUpdates),
    );
    const existingBase = mediaUpdates[dateKey] || mediaMap[dateKey];
    mediaUpdates[dateKey] = { ...existingBase, isSeasonPreview: true };
  }

  return { mediaUpdates, weekUpdatePromise };
};
