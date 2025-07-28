import { EWeekType, EYearsWeekIndxsValues, THolidayName } from '@/types';

import { renderWeek } from './renderWeek';
import { GRID_GAP } from '../constants';
import { ESide, TLifeGridState } from '../types';

const PADDING_TOP = 45;
const PADDING_BOTTOM = 74;

export const renderYearList = (state: TLifeGridState) => {
  const { app, drawWeekIndexes, theme, isMedium, lifeMode, today } = state;

  const { lastWeekIndex, yearsIndxs, yearRows } = drawWeekIndexes;

  const width = app?.renderer.width || 0;
  const height = app?.renderer.height || 0;

  // Fixed number of elements per row (53)
  const cols = 53;
  const rows = yearRows;

  // --- Quadratic and adaptive gap ---
  const minRows = 90;
  let cellHeight: number;
  let actualGap: number;
  // Padding for header and navbar in years mode
  const paddingTop = isMedium ? PADDING_TOP : 10;
  const paddingBottom = isMedium ? PADDING_BOTTOM : 10;

  const availableHeight = height - paddingTop - paddingBottom;
  if (rows < minRows) {
    cellHeight = (availableHeight - GRID_GAP * (minRows + 1)) / minRows;
    actualGap = (availableHeight - cellHeight * rows) / (rows + 1);
  } else {
    cellHeight = (availableHeight - GRID_GAP * (rows + 1)) / rows;
    actualGap = GRID_GAP;
  }
  const cellWidth = (width - GRID_GAP * (cols + 1)) / cols;

  let currentRow = 0;
  let currentCol = 0;

  const getPosition = () => ({
    x: currentCol * (cellWidth + GRID_GAP) + GRID_GAP,
    y: paddingTop + currentRow * (cellHeight + actualGap) + actualGap,
  });

  const baseProps = {
    theme,
    cellWidth,
    cellHeight,
    isMedium: isMedium || false,
    stage: app?.stage,
    lifeMode,
    weekType: EWeekType.Present,
    holiday: null as THolidayName | null,
  };

  for (let i = 0; i < lastWeekIndex; i++) {
    const drawType = yearsIndxs[i];

    const holiday = drawWeekIndexes.holidaysIndxs[i];
    const weekType =
      i > today.todayWeekIndex
        ? EWeekType.Future
        : i === today.todayWeekIndex
          ? EWeekType.Present
          : EWeekType.Past;

    baseProps.holiday = holiday;
    baseProps.weekType = weekType;

    const render = (half: false | ESide) => {
      renderWeek({
        ...baseProps,
        ...getPosition(),
        half,
      });
    };

    switch (drawType) {
      case EYearsWeekIndxsValues.Half:
        if (i === 0) {
          render(ESide.Right);
        } else if (i === lastWeekIndex - 1) {
          render(ESide.Left);
        } else {
          currentCol++;
          render(ESide.Left);
          currentRow++;
          currentCol = 0;
          render(ESide.Right);
        }
        break;

      case EYearsWeekIndxsValues.HalfLeap:
        currentRow++;
        currentCol = 0;
        render(ESide.Right);
        break;

      case EYearsWeekIndxsValues.FullFirst:
        currentRow++;
        currentCol = 0;
        render(false);
        break;

      default:
        currentCol++;
        render(false);
    }
  }
};
