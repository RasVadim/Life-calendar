import { FC, useCallback, useLayoutEffect, useRef } from 'react';

import cx from 'classnames';

import { useDevice } from '@/hooks';
import { useSetSyncPending } from '@/store/atoms';
import { IWeek } from '@/store/clientDB';
import { TZodiacIconSet } from '@/types';

import { Season } from './components';

import s from './s.module.styl';

type TProps = {
  weeks: IWeek[];
  offsetBegin: number[];
  isByWidth: boolean;
  todayWeekId: string;
  zodiacIconSet: TZodiacIconSet;
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

export const SeasonsGrid: FC<TProps> = ({
  weeks,
  offsetBegin,
  isByWidth,
  todayWeekId,
  zodiacIconSet,
}) => {
  const { isMedium } = useDevice();

  const grouped = groupWeeksBySeason(weeks);
  const seasonKeys = Object.keys(grouped);

  const seasonRefs = useRef<(HTMLDivElement | null)[]>([]);
  const setPending = useSetSyncPending();

  const scrollToTodayWeek = useCallback(() => {
    setPending(true);
    if (!todayWeekId) return;

    // Find the index of the season containing the current week
    const idx = seasonKeys.findIndex((key) =>
      grouped[key].some((week) => typeof week !== 'number' && week.id === todayWeekId),
    );
    if (idx !== -1 && seasonRefs.current[idx]) {
      seasonRefs.current[idx]?.scrollIntoView({ block: 'center', behavior: 'auto' });
    }
    // Give the browser a tick to finish scroll before showing content
    setTimeout(() => setPending(false), 0);
  }, [todayWeekId, seasonKeys.join(','), weeks]);

  useLayoutEffect(() => {
    scrollToTodayWeek();
  }, [scrollToTodayWeek]);

  return (
    <div className={cx(s.wrapper, { [s.transparent]: !todayWeekId })}>
      {seasonKeys.map((key, idx) => {
        let seasonWeeks = grouped[key] as (IWeek | number)[];
        if (idx === 0) {
          seasonWeeks = [...offsetBegin, ...seasonWeeks];
        }
        if (idx === seasonKeys.length - 1) {
          const emptyCount = 13 - offsetBegin.length;
          if (emptyCount > 0) {
            seasonWeeks = [...seasonWeeks, ...Array(emptyCount).fill(0)];
          }
        }
        const [year, season] = key.split('-');

        // Get zodiac from the first week of the season
        const firstWeek = seasonWeeks.find((week) => typeof week !== 'number') as IWeek | undefined;
        const zodiac = firstWeek?.yearZodiacLabel || '';

        return (
          <div ref={(el) => (seasonRefs.current[idx] = el)} key={key}>
            <Season
              year={year}
              zodiac={zodiac}
              season={season}
              weeks={seasonWeeks}
              isByWidth={isByWidth}
              isMediumScreen={isMedium}
              zodiacIconSet={zodiacIconSet}
            />
          </div>
        );
      })}
    </div>
  );
};
