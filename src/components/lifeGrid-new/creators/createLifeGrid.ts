import { Color, Container } from 'pixi.js';

import { HOLIDAY_NAMES } from '@/constants';
import { ESide, EYearsWeekIndxsValues, THolidayName } from '@/types';

import {
  GRID_GAP,
  PADDING_BOTTOM,
  PADDING_DESKTOP,
  PADDING_TOP,
  QUADRATIC_WEEK_ROWS_LEVEL,
} from '../constants';
import { TLifeGridState } from '../types';
import { createWeek } from './createWeek';

let cachedBackgroundColor: string | null = null;

type TCreateProps = {
  half: ESide | false;
  stage?: Container | null;
  holiday?: THolidayName | null;
};

export const createLifeGrid = ({ app, drawWeekIndexes, theme, isScreenMedium }: TLifeGridState) => {
  if (!app) return;

  // clear stage before rendering a new grid, to avoid artifacts
  if (app.stage && app.stage.removeChildren) {
    app.stage.removeChildren(); // remove all old elements
  }

  const { lastWeekIndex, yearsIndxs, yearRows } = drawWeekIndexes;

  if (cachedBackgroundColor !== theme.background) {
    const backgroundColor = new Color(theme.background);
    app.renderer.background.color = backgroundColor.toNumber();
    cachedBackgroundColor = theme.background;
  }

  const width = app?.renderer.width || 0;
  const height = app?.renderer.height || 0;

  // Fixed number of elements per row (53)
  const cols = 53;
  const isMoreThanQuadratic = yearRows > QUADRATIC_WEEK_ROWS_LEVEL;
  const rows = isMoreThanQuadratic ? yearRows : QUADRATIC_WEEK_ROWS_LEVEL;
  const gridGap = GRID_GAP[isScreenMedium ? 'small' : 'large'];

  // Padding for header and navbar in years mode
  const paddingTop = isScreenMedium ? PADDING_TOP : PADDING_DESKTOP;
  const paddingBottom = isScreenMedium ? PADDING_BOTTOM : PADDING_DESKTOP;

  const availableHeight = height - paddingTop - paddingBottom;

  const cellHeight = (availableHeight - gridGap * (rows + 1)) / rows;
  const cellWidth = (width - gridGap * (cols + 1)) / cols;
  const actualGap = isMoreThanQuadratic
    ? gridGap
    : (availableHeight - cellHeight * rows) / (rows + 1);

  //Render week list
  let currentRow = 0;
  let currentCol = 0;

  const getPosition = () => ({
    x: currentCol * (cellWidth + gridGap) + gridGap,
    y: paddingTop + currentRow * (cellHeight + actualGap) + actualGap,
  });

  const baseProps = {
    theme,
    cellWidth,
    cellHeight,
    isScreenMedium: isScreenMedium,
    stage: app?.stage,
    holiday: null as THolidayName | null,
  };

  for (let i = 0; i < lastWeekIndex; i++) {
    const drawType = yearsIndxs[i];

    const create = ({ half, stage, holiday }: TCreateProps) => {
      createWeek({
        ...baseProps,
        ...getPosition(),
        ...(stage ? { stage } : {}),
        half,
        holiday,
      });
    };

    switch (drawType) {
      case EYearsWeekIndxsValues.Half:
        if (i === 0) {
          create({ half: ESide.Right, holiday: HOLIDAY_NAMES.birthday });
        } else if (i === lastWeekIndex - 1) {
          currentRow++;
          create({ half: ESide.Left });
        } else {
          // Create container for two weeks that will be positioned separately
          const twoWeekHalfsContainer = new Container();
          app?.stage.addChild(twoWeekHalfsContainer);

          currentCol++;
          create({
            half: ESide.Left,
            stage: twoWeekHalfsContainer,
            holiday: HOLIDAY_NAMES.birthday,
          });
          currentRow++;
          currentCol = 0;
          create({
            half: ESide.Right,
            stage: twoWeekHalfsContainer,
            holiday: HOLIDAY_NAMES.birthday,
          });
        }
        break;

      case EYearsWeekIndxsValues.HalfLeap:
        currentRow++;
        currentCol = 0;
        create({ half: ESide.Right, holiday: HOLIDAY_NAMES.birthday });
        break;

      case EYearsWeekIndxsValues.FullFirst:
        if (i !== 0) {
          currentRow++;
          currentCol = 0;
        }
        create({ half: false, holiday: HOLIDAY_NAMES.birthday });
        break;

      default:
        currentCol++;
        create({ half: false });
    }
  }
};
