import { Container, Renderer, Sprite, Text, Texture } from 'pixi.js';

import i18n from '@/i18n';

import { getCachedColor } from '../utils';

// Constants for month labels (exported so the seasons icon aligns with them).
export const LABEL_FONT_SIZE = 13;
export const LABEL_MARGIN_BOTTOM = 36;
const LABEL_GAP = 8;
export const LABEL_LEFT_MARGIN = 26;

const DEFAULT_TEXT_STYLE = {
  fontFamily: 'Montserrat, sans-serif',
  fontSize: LABEL_FONT_SIZE,
  fontWeight: '300' as const,
};

// Cache label textures keyed by string (font is fixed). Rendered white so colour
// comes from the sprite tint — one texture serves every theme / month colour.
// Persists across paints, so months (~960 rows) rasterizes each unique string
// ONCE instead of ~1920 Text objects every time the mode is painted.
type TCachedText = { texture: Texture; width: number; height: number };
const textCache = new Map<string, TCachedText>();

export const clearLabelCache = (): void => {
  textCache.clear();
};

const getCachedText = (renderer: Renderer, text: string): TCachedText => {
  let cached = textCache.get(text);
  if (!cached || cached.texture.destroyed) {
    const node = new Text({ text, style: { ...DEFAULT_TEXT_STYLE, fill: 0xffffff } });
    // Measure in logical units before baking, so sprite sizing is resolution-proof.
    const width = node.width;
    const height = node.height;
    const texture = renderer.generateTexture({ target: node, resolution: renderer.resolution });
    node.destroy();
    cached = { texture, width, height };
    textCache.set(text, cached);
  }
  return cached;
};

type TRenderLabelParams = {
  container: Container;
  renderer: Renderer;
  month?: string | null;
  season?: string | null;
  year: string;
  x: number;
  y: number;
  theme: Record<string, string>;
  labelColor?: string; // explicit label colour (e.g. seasons match their thread)
  leftMargin?: number; // year indent override (seasons push right to fit the icon)
};

/**
 * Render month/season and year label for a row as tinted sprites off cached
 * white-text textures (see getCachedText).
 */
export const renderLabel = ({
  container,
  renderer,
  month,
  season,
  year,
  x,
  y,
  theme,
  labelColor: labelColorOverride,
  leftMargin = LABEL_LEFT_MARGIN,
}: TRenderLabelParams) => {
  const labelKey = month || season || '';
  const label = i18n.t(`life.${labelKey}`);

  let labelColor = labelColorOverride ?? theme.text;

  if (!labelColorOverride && month) {
    // Get month color based on alternating pattern starting from January
    const monthNumber = parseInt(month, 10);
    const isEvenMonth = monthNumber % 2 === 0;
    labelColor = isEvenMonth ? theme.primary2 : theme.primary;
  }

  const labelTopY = y - LABEL_MARGIN_BOTTOM - LABEL_FONT_SIZE;

  const yearCached = getCachedText(renderer, year);
  const yearSprite = new Sprite(yearCached.texture);
  yearSprite.setSize(yearCached.width, yearCached.height);
  yearSprite.tint = getCachedColor(theme.text).toNumber();
  yearSprite.position.set(x + leftMargin, labelTopY);

  const labelCached = getCachedText(renderer, label);
  const labelSprite = new Sprite(labelCached.texture);
  labelSprite.setSize(labelCached.width, labelCached.height);
  labelSprite.tint = getCachedColor(labelColor).toNumber();
  // 8px gap between year and month/season
  labelSprite.position.set(yearSprite.x + yearCached.width + LABEL_GAP, labelTopY);

  container.addChild(yearSprite);
  container.addChild(labelSprite);
};
