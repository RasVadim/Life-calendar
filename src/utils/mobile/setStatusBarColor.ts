/**
 * Sets the background color in the meta[name="theme-color"] tag.
 *
 * @param {string} color - The color value to set. --background-color gets by default.
 */
export const setStatusBarColor = (color?: string) => {
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeColorMeta) return;

  if (!color) {
    const body = document.querySelector('body');
    if (!body) return;

    const bgColor = getComputedStyle(body).getPropertyValue('--background-color').trim();
    themeColorMeta.setAttribute('content', bgColor);
    return;
  }

  themeColorMeta.setAttribute('content', color);
};
