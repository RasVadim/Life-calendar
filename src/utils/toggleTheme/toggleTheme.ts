import { EThemeMode } from '@/store/atoms';

/**
 * Toggles the theme of the App between light and dark.
 * 
 * @param {EThemeMode} theme - The theme to toggle between.
 * @return {void} This function does not return a value.
 */
export function toggleTheme(theme: EThemeMode) {
  const body = document.querySelector('body');
  console.log('theme', theme);
  if (!body) return;

  const isDarkTheme = theme === EThemeMode.DARK;
  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  console.log('isDarkTheme', isDarkTheme);
  if (!themeColorMeta) return;

  if (isDarkTheme) {
    body.classList.remove('light-theme');
    body.classList.add('dark-theme');
    themeColorMeta.setAttribute(
      'content',
      getComputedStyle(document.documentElement).getPropertyValue(
        '--background-color-light'
      )
    );
  } else {
    body.classList.remove('dark-theme');
    body.classList.add('light-theme');
    themeColorMeta.setAttribute(
      'content',
      getComputedStyle(document.documentElement).getPropertyValue(
        '--background-color-dark'
      )
    );
  }
}
