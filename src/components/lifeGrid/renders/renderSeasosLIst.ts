import { Container, Graphics } from 'pixi.js';

import { IWeek } from '@/store/clientDB';
import { TLifeMode, TZodiacIconSet } from '@/types';

import { renderSeason } from './renderSeason';

const ROW_GAP = 40;

type TRenderSeasonsProps = {
  weeks: IWeek[];
  theme: Record<string, string>;
  width: number;
  gap?: number;
  isMedium?: boolean;
  mode: TLifeMode;
  zodiacIconSet?: TZodiacIconSet;
};

export const renderSeasonList = ({
  weeks,
  theme,
  width,
  gap = 1.5,
  isMedium,
  mode,
  zodiacIconSet,
}: TRenderSeasonsProps) => {
  // --- Grouping by seasons ---
  const grouped: Record<string, IWeek[]> = {};
  weeks.forEach((week) => {
    let key: string;
    if (week.dateSeason === 'winter') {
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
  const seasonKeys = Object.keys(grouped);
  const seasonOrder = ['spring', 'summer', 'autumn', 'winter'];
  seasonKeys.sort((a, b) => {
    const [yearA, seasonA] = a.split('-');
    const [yearB, seasonB] = b.split('-');
    if (yearA !== yearB) return Number(yearA) - Number(yearB);
    return seasonOrder.indexOf(seasonA) - seasonOrder.indexOf(seasonB);
  });
  // Create scrollable container
  const scrollContainer = new Container();
  // For calculating the maximum width of the line (for extra space)
  let maxCols = 0;
  let maxCellHeight = 0;
  // Top extra space
  const topExtraSpace = maxCellHeight * 2 + ROW_GAP;
  const gTop = new Graphics();
  gTop.rect(0, 0, (maxCellHeight + gap) * maxCols, topExtraSpace);
  gTop.fill({ color: 0x000000, alpha: 0 });
  // Add top offset for all seasons
  const TOP_OFFSET = 14; // px, можно подправить по вкусу
  // Define the first and last season key
  const firstSeasonKey = seasonKeys[0];
  const lastSeasonKey = seasonKeys[seasonKeys.length - 1];
  // Render weeks by seasons
  let offsetY = topExtraSpace + TOP_OFFSET;
  let presentWeek: IWeek | null = null;
  let presentRow = 0;
  // presentCol is not needed anymore
  // First pass: find presentWeek
  seasonKeys.forEach((key, rowIdx) => {
    const seasonWeeks = grouped[key];
    for (let colIdx = 0; colIdx < seasonWeeks.length; colIdx++) {
      if (seasonWeeks[colIdx].type === 'present') {
        presentWeek = seasonWeeks[colIdx];
        presentRow = rowIdx;
        break;
      }
    }
  });
  // Second pass: render all seasons
  seasonKeys.forEach((key, rowIdx) => {
    const seasonWeeks = grouped[key];
    const isFirst = key === firstSeasonKey;
    const isLast = key === lastSeasonKey;
    let presentColIdx: number | undefined = undefined;
    const { container, cellHeight, cols } = renderSeason({
      seasonWeeks,
      theme,
      width,
      gap,
      offsetY,
      isMedium,
      mode,
      isFirst,
      isLast,
      zodiacIconSet,
      presentWeekId: presentWeek ? presentWeek.id : undefined,
      onPresentWeek: (colIdx) => {
        presentColIdx = colIdx;
      },
    });
    if (cols > maxCols) maxCols = cols;
    if (cellHeight > maxCellHeight) maxCellHeight = cellHeight;
    scrollContainer.addChild(container);
    // If presentWeek in this season — render separately
    if (presentWeek && presentColIdx !== undefined && rowIdx === presentRow) {
      renderSeason({
        seasonWeeks: [presentWeek],
        theme,
        width,
        gap,
        offsetY,
        isMedium,
        mode,
        isFirst,
        isLast,
        zodiacIconSet,
        presentWeekId: undefined,
        onPresentWeek: undefined,
      });
      // But presentWeek is already rendered through renderWeek inside renderSeason, so we don't do anything
    }
    offsetY += cellHeight + ROW_GAP;
  });
  // Add extra space for scroll
  scrollContainer.addChild(gTop);
  const extraSpace = maxCellHeight * 4 + ROW_GAP * 2;
  const g = new Graphics();
  g.rect(0, offsetY, (maxCellHeight + gap) * maxCols, extraSpace);
  g.fill({ color: 0x000000, alpha: 0 });
  scrollContainer.addChild(g);
  return scrollContainer;
};
