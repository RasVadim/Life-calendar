import { blendColors, hexToRgb, rgbToHex } from '@/utils';

/**
 * Dynamically sets the status bar color (meta[name="theme-color"]) to a blend
 * of the current status bar color and blackout color with 0.45 opacity, for drawer overlays.
 */
export const changeByDrawerStatusBarColor = () => {
  const body = document.querySelector('body');
  if (!body) return;

  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeColorMeta) return;

  // Get the current status bar color from meta tag
  const currentStatusBarColor = themeColorMeta.getAttribute('content') || '#000000';
  const blackoutColor = getComputedStyle(body).getPropertyValue('--blackout-color').trim();
  const currentStatusBarColorRgb = hexToRgb(currentStatusBarColor);
  const blackoutColorRgb = hexToRgb(blackoutColor);
  const [r, g, b] = blendColors(currentStatusBarColorRgb, blackoutColorRgb, 0.45);
  const blendedColor = rgbToHex(r, g, b);

  themeColorMeta.setAttribute('content', blendedColor);

  return currentStatusBarColor;
};
