import { Color, Container, Text } from 'pixi.js';

import { IWeek } from '@/store/clientDB';
import { TLifeMode, TWeekZodiac, TZodiacIconSet } from '@/types';

import { renderIcon } from './renderIcon';
import { renderWeek } from './renderWeek';
import { ZODIAC_ICON_SIZE } from '../constants';

const LABEL_PADDING = 5;
const LABEL_GAP = 4;
const LABEL_FONT_SIZE = 13;
const ROW_GAP = 40;
const ZODIAC_ICON_OFFSET = 26;

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
    const textColor = new Color(theme.text);
    const yearText = new Text({
      text: year,
      style: {
        fontFamily: 'Montserrat, sans-serif',
        fontSize: LABEL_FONT_SIZE,
        fontWeight: '400',
        fill: textColor,
        align: 'left',
      },
    });
    //  check if zodiac icon is needed
    const hasZodiacIcon =
      zodiac && zodiacIconSet && typeof zodiacIconSet[zodiac as TWeekZodiac] === 'string';
    const leftOffset = hasZodiacIcon ? ZODIAC_ICON_OFFSET : 0;

    yearText.x = colGap + cellWidth / 2 + leftOffset;
    yearText.y = offsetY + ROW_GAP / 2 - LABEL_PADDING;

    const primaryColor = new Color(theme.primary);

    const seasonText = new Text({
      text: ` ${season}`,
      style: {
        fontFamily: 'Montserrat, sans-serif',
        fontSize: LABEL_FONT_SIZE,
        fontWeight: '400',
        fill: primaryColor,
        align: 'left',
      },
    });
    seasonText.x = yearText.x + yearText.width + LABEL_GAP;
    seasonText.y = yearText.y;
    container.addChild(yearText);
    container.addChild(seasonText);

    // Add zodiac icon
    if (hasZodiacIcon) {
      renderIcon({
        primaryColor: primaryColor.toNumber(),
        container,
        position: {
          x: colGap + cellWidth / 2 + LABEL_PADDING,
          y: yearText.y + (yearText.height - ZODIAC_ICON_SIZE) / 2,
        },
        zodiac,
        zodiacIconSet,
      });
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
