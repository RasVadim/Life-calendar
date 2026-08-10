import { Container, Text } from 'pixi.js';

import i18n from '@/i18n';

import { getCachedColor } from '../utils';

// Constants for month labels
const LABEL_FONT_SIZE = 13;
const LABEL_MARGIN_BOTTOM = 36;
const LABEL_GAP = 8;
const LABEL_LEFT_MARGIN = 26;

const DEFAULT_TEXT_STYLE = {
  fontFamily: 'Montserrat, sans-serif',
  fontSize: LABEL_FONT_SIZE,
  fontWeight: '300' as const,
};

type TRenderLabelParams = {
  container: Container;
  month?: string | null;
  season?: string | null;
  year: string;
  x: number;
  y: number;
  theme: Record<string, string>;
};

/**
 * Render month and year label for a row
 */
export const renderLabel = ({
  container,
  month,
  season,
  year,
  x,
  y,
  theme,
}: TRenderLabelParams) => {
  const labelKey = month || season || '';

  const label = i18n.t(`life.${labelKey}`);

  let labelColor = theme.text;

  if (month) {
    // Get month color based on alternating pattern starting from January
    const monthNumber = parseInt(month, 10);
    const isEvenMonth = monthNumber % 2 === 0;
    labelColor = isEvenMonth ? theme.primary2 : theme.primary;
  }

  // Create month text with alternating color
  const labelText = new Text({
    text: label,
    style: {
      ...DEFAULT_TEXT_STYLE,
      fill: getCachedColor(labelColor).toNumber(),
    },
  });

  // Create year text with text color
  const yearText = new Text({
    text: year,
    style: {
      ...DEFAULT_TEXT_STYLE,
      fill: getCachedColor(theme.text).toNumber(),
    },
  });

  // Position texts
  yearText.x = x + LABEL_LEFT_MARGIN;
  yearText.y = y - LABEL_MARGIN_BOTTOM - LABEL_FONT_SIZE;

  labelText.x = yearText.x + yearText.width + LABEL_GAP; // 8px gap between year and month
  labelText.y = y - LABEL_MARGIN_BOTTOM - LABEL_FONT_SIZE;

  container.addChild(yearText);
  container.addChild(labelText);
};
