import { EThemeMode } from '@/store/atoms';

/**
 * Toggles the theme of the App between available themes.
 *
 * @param {EThemeMode} theme - The theme to toggle to.
 * @return {void} This function does not return a value.
 */
export function toggleTheme(theme: EThemeMode) {
  const body = document.querySelector('body');
  if (!body) return;

  const themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (!themeColorMeta) return;

  // Удаляем все возможные классы тем
  Object.values(EThemeMode).forEach((mode) => {
    body.classList.remove(`${mode}-theme`);
  });

  // Добавляем нужный класс
  body.classList.add(`${theme}-theme`);

  // Берём цвет из переменной на body
  const bgColor = getComputedStyle(body).getPropertyValue('--background-color').trim();
  themeColorMeta.setAttribute('content', bgColor);
}
