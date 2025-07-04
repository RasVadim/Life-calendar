import { FC, useMemo } from 'react';

import cx from 'classnames';

import { IWeek } from '@/store/clientDB';
import { TLifeMode } from '@/types/life';

import { Week } from '../week/Week';

import s from './s.module.styl';

type TProps = {
  weekId?: string;
  weeks?: IWeek[];
  isVisible?: boolean;
  lifeMode?: TLifeMode;
};

function getDateYearRange(weeks: IWeek[]): string {
  if (!weeks.length) return '';
  const years = weeks.map((w) => Number(w.dateYear)).filter(Boolean);
  if (!years.length) return '';
  const min = Math.min(...years);
  const max = Math.max(...years);
  return min === max ? String(min) : `${min} - ${max}`;
}

export const VirtualRow: FC<TProps> = ({
  weekId,
  weeks,
  isVisible = false,
  lifeMode = 'WEEKS',
}) => {
  // Find weeks for three years
  const { yearWeeks, prevYearWeeks, nextYearWeeks } = useMemo(() => {
    if (!weekId || !weeks) return { yearWeeks: [], prevYearWeeks: [], nextYearWeeks: [] };
    const yearMatch = weekId.match(/w(\d+)_/);
    if (!yearMatch) return { yearWeeks: [], prevYearWeeks: [], nextYearWeeks: [] };
    const targetYear = parseInt(yearMatch[1]);
    const prevYear = targetYear - 1;
    const nextYear = targetYear + 1;
    return {
      yearWeeks: weeks.filter((w) => w.year === targetYear),
      prevYearWeeks: weeks.filter((w) => w.year === prevYear),
      nextYearWeeks: weeks.filter((w) => w.year === nextYear),
    };
  }, [weekId, weeks]);

  const dateYearRange = getDateYearRange(yearWeeks);
  const prevYearRange = getDateYearRange(prevYearWeeks);
  const nextYearRange = getDateYearRange(nextYearWeeks);

  if (!isVisible || !weekId) return null;

  return (
    <div className={s.wrapper}>
      <div className={s.content}>
        <div className={s.header}>
          <div className={s.sideLabel}>{prevYearRange}</div>
          <div className={s.label}>{dateYearRange}</div>
          <div className={s.sideLabel}>{nextYearRange}</div>
        </div>
        <div className={s.zoomArea}>
          <div className={s.weeksContainer}>
            {prevYearWeeks.map((week) => (
              <Week key={week.id} id={week.id} week={week} isByWidth={true} lifeMode={lifeMode} />
            ))}
          </div>

          <div className={s.weeksContainer}>
            {yearWeeks.map((week) => (
              <Week key={week.id} id={week.id} week={week} isByWidth={true} lifeMode={lifeMode} />
            ))}
          </div>

          <div className={s.weeksContainer}>
            {nextYearWeeks.map((week) => (
              <Week key={week.id} id={week.id} week={week} isByWidth={true} lifeMode={lifeMode} />
            ))}
          </div>
        </div>
      </div>
      <div className={cx(s.blackout, { [s.hidden]: !isVisible })} />
    </div>
  );
};
