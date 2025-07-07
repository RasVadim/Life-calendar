import { FC, useMemo } from 'react';

import cx from 'classnames';

import { useTranslation } from '@/hooks';
import { useZoomCentralWeek } from '@/store/atoms';
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

function getDateYearRange(weeks: IWeek[]): { min: number; max: number } {
  if (!weeks.length) return { min: 0, max: 0 };
  const years = weeks.map((w) => Number(w.dateYear)).filter(Boolean);
  if (!years.length) return { min: 0, max: 0 };
  const min = Math.min(...years);
  const max = Math.max(...years);
  return { min, max };
}

export const VirtualRow: FC<TProps> = ({
  weekId: _weekId,
  weeks,
  isVisible = false,
  lifeMode = 'WEEKS',
}) => {
  const { t } = useTranslation();

  // Получаем id центральной недели из jotai atom
  const [zoomCentralWeekId] = useZoomCentralWeek();
  const weekId = zoomCentralWeekId || _weekId;

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

  // Находим центральную неделю и её сезон
  const centralWeek = yearWeeks.find((w) => w.id === weekId);
  const centralSeason = centralWeek?.dateSeason;

  // Находим все группы подряд идущих недель этого сезона в yearWeeks
  const seasonGroups: { start: number; end: number }[] = [];
  if (centralSeason) {
    let groupStart = -1;
    for (let i = 0; i < yearWeeks.length; i++) {
      if (yearWeeks[i].dateSeason === centralSeason) {
        if (groupStart === -1) groupStart = i;
        // если это последняя неделя или следующая уже не тот сезон — закрываем группу
        if (i === yearWeeks.length - 1 || yearWeeks[i + 1].dateSeason !== centralSeason) {
          seasonGroups.push({ start: groupStart, end: i });
          groupStart = -1;
        }
      } else {
        groupStart = -1;
      }
    }
  }
  // Находим группу, в которую входит центральная неделя
  let highlightGroup: { start: number; end: number } | null = null;
  if (seasonGroups.length && centralWeek) {
    const idx = yearWeeks.findIndex((w) => w.id === centralWeek.id);
    highlightGroup = seasonGroups.find((g) => idx >= g.start && idx <= g.end) || null;
  }

  // --- Highlight group in next year (продолжение сезона) ---
  let nextHighlightGroup: { start: number; end: number } | null = null;
  if (
    centralSeason &&
    nextYearWeeks.length &&
    highlightGroup &&
    highlightGroup.end === yearWeeks.length - 1 // группа заканчивается в конце года
  ) {
    let groupStart = -1;
    for (let i = 0; i < nextYearWeeks.length; i++) {
      if (nextYearWeeks[i].dateSeason === centralSeason) {
        if (groupStart === -1) groupStart = i;
        // если это последняя неделя или следующая уже не тот сезон — закрываем группу
        if (i === nextYearWeeks.length - 1 || nextYearWeeks[i + 1].dateSeason !== centralSeason) {
          // Берём только первую группу
          nextHighlightGroup = { start: groupStart, end: i };
          break;
        }
      } else {
        if (groupStart !== -1) break;
        groupStart = -1;
      }
    }
  }

  const dateYearRange = getDateYearRange(yearWeeks);
  const prevYearRange = getDateYearRange(prevYearWeeks);
  const nextYearRange = getDateYearRange(nextYearWeeks);

  if (!isVisible || !weekId) return null;

  return (
    <div className={s.wrapper}>
      <div className={s.content}>
        <div className={s.header}>
          <div className={cx(s.label, { [s.activeLabel]: false })}>
            {!!prevYearRange.min && (
              <span
                className={cx({
                  [s.season]: prevYearRange.min === Number(centralWeek?.dateYear),
                  [s.month]: false,
                })}
              >
                {prevYearRange.min}
              </span>
            )}
            {!!prevYearRange.max && (
              <>
                {' '}
                -{' '}
                <span
                  className={cx({
                    [s.season]: prevYearRange.max === Number(centralWeek?.dateYear),
                    [s.month]: false,
                  })}
                >
                  {prevYearRange.max}
                </span>
              </>
            )}
          </div>
          <div className={cx(s.label, { [s.activeLabel]: true })}>
            {!!dateYearRange.min && (
              <span
                className={cx({
                  [s.season]: dateYearRange.min === Number(centralWeek?.dateYear),
                  [s.month]: false,
                })}
              >
                {dateYearRange.min}
              </span>
            )}
            {!!dateYearRange.max && (
              <>
                {' '}
                -{' '}
                <span
                  className={cx({
                    [s.season]: dateYearRange.max === Number(centralWeek?.dateYear),
                    [s.month]: false,
                  })}
                >
                  {dateYearRange.max}
                </span>
              </>
            )}
          </div>
          <div className={cx(s.label, { [s.activeLabel]: false })}>
            {!!nextYearRange.min && (
              <span
                className={cx({
                  [s.season]: nextYearRange.min === Number(centralWeek?.dateYear),
                  [s.month]: false,
                })}
              >
                {nextYearRange.min}
              </span>
            )}
            {!!nextYearRange.max && (
              <>
                {' '}
                -{' '}
                <span
                  className={cx({
                    [s.season]: nextYearRange.max === Number(centralWeek?.dateYear),
                    [s.month]: false,
                  })}
                >
                  {nextYearRange.max}
                </span>
              </>
            )}
          </div>
          {centralSeason && (
            <div
              className={cx(s.weeksGroupLabel, {
                [s.season]: true,
                [s.month]: false,
              })}
            >
              {t(`life.${centralSeason}`)}
            </div>
          )}
        </div>
        <div className={s.zoomArea}>
          <div className={s.weeksContainer}>
            {prevYearWeeks.map((week) => (
              <Week key={week.id} id={week.id} week={week} isByWidth={true} lifeMode={lifeMode} />
            ))}
          </div>

          <div className={s.weeksContainer}>
            {yearWeeks.map((week, idx) => {
              // Если это начало группы сезона — открываем div
              if (highlightGroup && idx === highlightGroup.start) {
                return (
                  <div
                    key={'seasonGroup'}
                    className={cx(s.seasonGroup, { [s.noMargin]: nextHighlightGroup })}
                  >
                    {yearWeeks.slice(highlightGroup.start, highlightGroup.end + 1).map((w) => (
                      <Week key={w.id} id={w.id} week={w} isByWidth={true} lifeMode={lifeMode} />
                    ))}
                  </div>
                );
              }
              // Пропускаем недели, которые уже отрисованы в группе
              if (highlightGroup && idx > highlightGroup.start && idx <= highlightGroup.end)
                return null;
              // Остальные недели
              return (
                <Week key={week.id} id={week.id} week={week} isByWidth={true} lifeMode={lifeMode} />
              );
            })}
          </div>

          <div className={s.weeksContainer}>
            {nextYearWeeks.map((week, idx) => {
              if (nextHighlightGroup && idx === nextHighlightGroup.start) {
                return (
                  <div key={'seasonGroupNext'} className={cx(s.seasonGroup, s.nextSeasonGroup)}>
                    {nextYearWeeks
                      .slice(nextHighlightGroup.start, nextHighlightGroup.end + 1)
                      .map((w) => (
                        <Week key={w.id} id={w.id} week={w} isByWidth={true} lifeMode={lifeMode} />
                      ))}
                  </div>
                );
              }
              if (
                nextHighlightGroup &&
                idx > nextHighlightGroup.start &&
                idx <= nextHighlightGroup.end
              )
                return null;
              return (
                <Week key={week.id} id={week.id} week={week} isByWidth={true} lifeMode={lifeMode} />
              );
            })}
          </div>
        </div>
      </div>
      <div className={cx(s.blackout, { [s.hidden]: !isVisible })} />
    </div>
  );
};
