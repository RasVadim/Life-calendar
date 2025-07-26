import { EDateSegment } from '@/types';

import { getSeason } from './getSeason';

/**
 * Determines which year/month/season the date belongs to
 * @param {Date} date - Date to determine the segment for
 * @param {EDateSegment} type - Type of segment to determine
 * @returns {string} Year/month/season
 */
export const getDateSegment = (date: Date, type: EDateSegment) => {
  switch (type) {
    case EDateSegment.Year:
      return String(date.getFullYear());
    case EDateSegment.Month:
      return String(date.getMonth() + 1).padStart(2, '0');
    case EDateSegment.Season:
      return getSeason(date.getMonth());
    default:
      return null;
  }
};
