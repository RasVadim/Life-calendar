import { blendColors, hexToRgb, rgbToHex } from '@/utils';

/**
 * Dynamically sets the status bar color (meta[name="theme-color"]) to a blend
 * of the background and blackout color with 0.45 opacity, for drawer overlays.
 */
export const changeByDrawerStatusBarColor = () => {
  const body = document.querySelector('body');
  if (!body) return;

  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeColorMeta) return;

  // Get the background color from the CSS variable on body
  const bgColor = getComputedStyle(body).getPropertyValue('--background-color').trim();
  const blackoutColor = getComputedStyle(body).getPropertyValue('--blackout-color').trim();
  const bgColorRgb = hexToRgb(bgColor);
  const blackoutColorRgb = hexToRgb(blackoutColor);
  const [r, g, b] = blendColors(bgColorRgb, blackoutColorRgb, 0.45);
  const bgColorRgbWithAlpha = rgbToHex(r, g, b);

  themeColorMeta.setAttribute('content', bgColorRgbWithAlpha);
};
