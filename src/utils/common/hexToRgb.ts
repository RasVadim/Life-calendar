/**
 * Converts a hex color string to an RGB array.
 * @param {string} hex - The hex color string (e.g. '#fff', '#ffffff').
 * @returns {number[]} The RGB color as [r, g, b].
 */
export const hexToRgb = (hex: string) => {
  hex = hex.replace('#', '');
  if (hex.length === 3)
    hex = hex
      .split('')
      .map((x) => x + x)
      .join('');
  const num = parseInt(hex, 16);
  return [num >> 16, (num >> 8) & 255, num & 255];
};
