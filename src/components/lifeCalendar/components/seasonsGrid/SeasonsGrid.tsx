import { FC } from 'react';

import { IWeek } from '@/store/clientDB';

import { Season } from './components';

import s from './s.module.styl';

type TProps = {
  weeks: IWeek[];
  offsetBegin: number[];
  isByWidth: boolean;
};

// Group weeks by season, making sure winter (Dec+Jan+Feb) is always a single row
const groupWeeksBySeason = (weeks: IWeek[]) => {
  const grouped: Record<string, IWeek[]> = {};
  weeks.forEach((week) => {
    // dateMonth: 1-12, dateSeason: 'winter'|'spring'|'summer'|'autumn'
    let key: string;
    if (week.dateSeason === 'winter') {
      // December belongs to current year, Jan/Feb to previous year for winter grouping
      const monthNum = Number(week.dateMonth);
      if (monthNum === 12) {
        key = `${week.dateYear}-winter`;
      } else {
        key = `${Number(week.dateYear) - 1}-winter`;
      }
    } else {
      key = `${week.dateYear}-${week.dateSeason}`;
    }
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(week);
  });
  return grouped;
};

export const SeasonsGrid: FC<TProps> = ({ weeks, offsetBegin, isByWidth }) => {
  const grouped = groupWeeksBySeason(weeks);
  // Sort by year, then by season order
  const seasonKeys = Object.keys(grouped);

  return (
    <div className={s.wrapper}>
      {seasonKeys.map((key, idx) => {
        let seasonWeeks = grouped[key] as (IWeek | number)[];
        // Add empty weeks to the beginning of the first season
        if (idx === 0) {
          seasonWeeks = [...offsetBegin, ...seasonWeeks];
        }
        // Add empty weeks to the end of the last season
        if (idx === seasonKeys.length - 1) {
          seasonWeeks = [...seasonWeeks, ...Array(13 - offsetBegin.length).fill(0)];
        }
        const [year, season] = key.split('-');
        return (
          <Season key={key} year={year} season={season} weeks={seasonWeeks} isByWidth={isByWidth} />
        );
      })}
    </div>
  );
};
