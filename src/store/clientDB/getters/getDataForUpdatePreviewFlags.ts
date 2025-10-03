import { lifeCalendarDB } from '@/store/clientDB';
import { IWeek, IMedia, IDrawWeekIndexes } from '@/store/clientDB';
import { TMediaDatesMap, TMedia } from '@/types';

type LoadRequiredDataResult = {
  currentWeek: IWeek;
  mediaData: IMedia;
  drawWeekIndexes: IDrawWeekIndexes | null;
  mediaMap: TMediaDatesMap<TMedia>;
};

/**
 * Loads required data for updating preview flags
 */
export const getDataForUpdatePreviewFlags = async (
  weekIndex: number,
): Promise<LoadRequiredDataResult | null> => {
  const [currentWeek, mediaData, drawWeekIndexes] = await Promise.all([
    lifeCalendarDB.weeks.where('index').equals(weekIndex).first(),
    lifeCalendarDB.media.get('main'),
    lifeCalendarDB.drawWeekIndexes.get('main'),
  ]);

  if (!currentWeek || !mediaData) {
    console.warn(`Week with index ${weekIndex} not found or media data missing`);

    return null;
  }

  return {
    currentWeek,
    mediaData,
    drawWeekIndexes: drawWeekIndexes || null,
    mediaMap: mediaData.media,
  };
};
