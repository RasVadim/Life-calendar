import { Container, Graphics, Text } from 'pixi.js';

import { IWeek } from '@/store/clientDB';
import { TLifeMode, TWeekZodiac, TZodiacIconSet } from '@/types';

import { renderWeek } from './renderWeek';

const LABEL_PADDING = 5;
const LABEL_GAP = 4;
const LABEL_FONT_SIZE = 13;
const ROW_GAP = 40;
const ZODIAC_ICON_SIZE = 14;
const ZODIAC_ICON_OFFSET = 29;

export type TRenderSeasonParams = {
  seasonWeeks: IWeek[];
  theme: Record<string, string>;
  width: number;
  gap: number;
  offsetY: number;
  isMedium?: boolean;
  mode: TLifeMode;
  isFirst: boolean;
  isLast: boolean;
  zodiacIconSet?: TZodiacIconSet;
  presentWeekId?: string;
  onPresentWeek?: (colIdx: number) => void;
};

export const renderSeason = ({
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
  presentWeekId,
  onPresentWeek,
}: TRenderSeasonParams) => {
  let cols = seasonWeeks.length;
  let cellWidth: number;
  let cellHeight: number;
  const colGap = gap;
  let offsetX = 0;

  // Special behavior for the first and last season
  if ((isFirst || isLast) && cols < 13) {
    cols = 13;
    cellWidth = (width - gap * (cols + 1)) / cols;
    cellHeight = cellWidth;
    if (isFirst) {
      // Align to the right
      offsetX = (cols - seasonWeeks.length) * (cellWidth + colGap);
    } else {
      // Last season — align to the left (offsetX = 0)
      offsetX = 0;
    }
  } else {
    cellWidth = (width - gap * (cols + 1)) / cols;
    cellHeight = cellWidth;
  }
  const container = new Container();
  const firstWeek = seasonWeeks[0] as IWeek | undefined;
  const zodiac = firstWeek?.yearZodiacLabel as TWeekZodiac | undefined;

  if (firstWeek && firstWeek.dateSeason) {
    const year = firstWeek.dateYear;
    const season = firstWeek.dateSeason.charAt(0).toUpperCase() + firstWeek.dateSeason.slice(1);
    const yearText = new Text({
      text: year,
      style: {
        fontFamily: 'Montserrat, sans-serif',
        fontSize: LABEL_FONT_SIZE,
        fontWeight: '400',
        fill: parseInt(theme.text.replace('#', ''), 16) || 0xffffff,
        align: 'left',
      },
    });
    //  check if zodiac icon is needed
    const hasZodiacIcon =
      zodiac && zodiacIconSet && typeof zodiacIconSet[zodiac as TWeekZodiac] === 'string';
    const leftOffset = hasZodiacIcon ? ZODIAC_ICON_OFFSET : 0;

    yearText.x = colGap + cellWidth / 2 + leftOffset;
    yearText.y = offsetY + ROW_GAP / 2 - LABEL_PADDING;

    const seasonText = new Text({
      text: ` ${season}`,
      style: {
        fontFamily: 'Montserrat, sans-serif',
        fontSize: LABEL_FONT_SIZE,
        fontWeight: '400',
        fill: parseInt(theme.primary.replace('#', ''), 16) || 0x7fd4ff,
        align: 'left',
      },
    });
    seasonText.x = yearText.x + yearText.width + LABEL_GAP;
    seasonText.y = yearText.y;
    container.addChild(yearText);
    container.addChild(seasonText);

    // Add zodiac icon
    if (hasZodiacIcon) {
      const iconPath = zodiacIconSet[zodiac as TWeekZodiac];
      if (typeof iconPath === 'string') {
        const primaryColor = theme.primary;
        fetch(iconPath)
          .then((res) => res.text())
          .then((svgString) => {
            const coloredSvg = svgString.replace(/fill="[^"]*"/g, `fill="${primaryColor}"`);
            const graphics = new Graphics().svg(coloredSvg);
            const iconSize = ZODIAC_ICON_SIZE;
            graphics.width = iconSize;
            graphics.height = iconSize;
            graphics.y = yearText.y + (yearText.height - iconSize) / 2;
            graphics.x = colGap + cellWidth / 2 + LABEL_PADDING;
            container.addChild(graphics);
          });
      }
    }
  }
  for (let colIdx = 0; colIdx < seasonWeeks.length; colIdx++) {
    const week = seasonWeeks[colIdx];
    if (!week) continue;
    const isPresent = presentWeekId && week.id === presentWeekId;
    if (isPresent && onPresentWeek) {
      onPresentWeek(colIdx);
    }
    const px = colIdx * (cellWidth + colGap) + colGap + offsetX;
    const py = offsetY + ROW_GAP;
    renderWeek({
      week,
      theme,
      x: px,
      y: py,
      cellWidth,
      cellHeight,
      isMedium: isMedium || false,
      isPresent: !!isPresent,
      stage: container,
      mode,
    });
  }
  return { container, cellHeight, cellWidth, cols, offsetX };
};
