type TSetStatusBarColorOptions = {
  colorName?: string;
  color?: string;
};

/**
 * Sets the background color in the meta[name="theme-color"] tag.
 *
 * @param {string} color - The color value to set. --background-color gets by default.
 */
export const setStatusBarColor = ({ colorName, color }: TSetStatusBarColorOptions = {}) => {
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeColorMeta) return;

  const body = document.querySelector('body');
  if (!body) return;

  const bgColor = getComputedStyle(body)
    .getPropertyValue(colorName || '--background-color')
    .trim();
  themeColorMeta.setAttribute('content', color || bgColor);
};
