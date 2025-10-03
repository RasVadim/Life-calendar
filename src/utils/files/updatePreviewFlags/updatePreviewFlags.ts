import { getDataForUpdatePreviewFlags, getWeeksInPeriods } from '@/store/clientDB';

import { applyUpdates, createMediaUpdates, hasMediaInWeek } from './helpers';
import { UpdatePreviewFlagsParams } from './types';

/**
 * Updates preview flags for week, month, and season when new media is uploaded.
 * Sets the new media as preview for the period that doesn't have any media yet.
 */
export const updatePreviewFlags = async ({
  dateKey,
  weekIndex,
  dayIndex,
}: UpdatePreviewFlagsParams) => {
  if (!weekIndex || !dayIndex) return;

  try {
    const data = await getDataForUpdatePreviewFlags(weekIndex);

    if (!data) return;

    const { currentWeek, mediaData, drawWeekIndexes, mediaMap } = data;
    const { month, season, year } = currentWeek;

    // Early exit if week already has media
    if (hasMediaInWeek(currentWeek.days, mediaMap, dateKey)) return;

    const [weeksInMonth, weeksInSeason] = await getWeeksInPeriods(month, season, year);

    const updates = createMediaUpdates({
      dateKey,
      dayIndex,
      currentWeek,
      weeksInMonth,
      weeksInSeason,
      mediaMap,
      monthHasMedia: weeksInMonth.some((week) => hasMediaInWeek(week.days, mediaMap, dateKey)),
      seasonHasMedia: weeksInSeason.some((week) => hasMediaInWeek(week.days, mediaMap, dateKey)),
    });

    await applyUpdates(updates, {
      mediaData,
      drawWeekIndexes,
      weekIndex,
      dateKey,
    });
  } catch (error) {
    console.error('Error updating preview flags:', error);
  }
};
