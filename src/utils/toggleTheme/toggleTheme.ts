import { EThemeMode } from '@/types';

/**
 * Toggles the theme of the App between available themes.
 *
 * @param {EThemeMode} theme - The theme to toggle to.
 * @return {void} This function does not return a value.
 */
export const toggleTheme = (theme: EThemeMode) => {
  const body = document.querySelector('body');
  if (!body) return;

  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeColorMeta) return;

  // Remove all possible theme classes from body
  Object.values(EThemeMode).forEach((mode) => {
    body.classList.remove(`${mode}-theme`);
  });

  // Add the selected theme class
  body.classList.add(`${theme}-theme`);

  // Get the background color from the CSS variable on body
  const bgColor = getComputedStyle(body).getPropertyValue('--background-color').trim();
  themeColorMeta.setAttribute('content', bgColor);
};
