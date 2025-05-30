import { getSeason } from './getSeason';

/**
 * Determines which year/month/season the week belongs to (by majority of days)
 * @param {Date[]} dates - Array of dates in the week
 * @param {'year' | 'month' | 'season'} type - Type of period to determine
 * @returns {string} Majority year/month/season
 */
export const getMajorityDate = (dates: Date[], type: 'year' | 'month' | 'season') => {
  const map = new Map<string, number>();
  for (const d of dates) {
    let key = '';
    if (type === 'year') key = String(d.getFullYear());
    if (type === 'month') key = String(d.getMonth() + 1);
    if (type === 'season') key = getSeason(d.getMonth());
    map.set(key, (map.get(key) || 0) + 1);
  }
  let maxKey = '';
  let max = 0;
  for (const [k, v] of map.entries()) {
    if (v > max) {
      max = v;
      maxKey = k;
    }
  }
  return maxKey;
}; 