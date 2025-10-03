import {
  IMedia,
  IDrawWeekIndexes,
  updateDBMedia,
  updateDBMonthWeekIndexes,
} from '@/store/clientDB';
import { TMediaDatesMap, TMedia } from '@/types';

type MediaUpdatesResult = {
  mediaUpdates: TMediaDatesMap<TMedia>;
  weekUpdatePromise: Promise<void> | null;
};

type ApplyUpdatesParams = {
  mediaData: IMedia;
  drawWeekIndexes: IDrawWeekIndexes | null;
  weekIndex: number;
  dateKey: string;
};

/**
 * Applies all updates to database (media, week, drawWeekIndexes)
 */
export const applyUpdates = async (
  updates: MediaUpdatesResult,
  params: ApplyUpdatesParams,
): Promise<void> => {
  const promises: Promise<void>[] = [];

  const { mediaUpdates, weekUpdatePromise } = updates;

  // Apply media updates
  if (Object.keys(mediaUpdates).length > 0) {
    promises.push(updateDBMedia(mediaUpdates));
  }

  // Update week if needed
  if (weekUpdatePromise) {
    promises.push(weekUpdatePromise);
  }

  // Update drawWeekIndexes
  if (params.drawWeekIndexes) {
    promises.push(
      updateDBMonthWeekIndexes({
        weekIndex: params.weekIndex,
        dateKey: params.dateKey,
      }),
    );
  }

  await Promise.all(promises);
};
