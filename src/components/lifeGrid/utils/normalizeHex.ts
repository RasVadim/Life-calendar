/**
 * Normalizes a HEX color string to 6-digit format.
 *
 * @param hex - HEX color string (e.g. '#fff', '#123456')
 * @returns Normalized 6-digit HEX color string (e.g. '#ffffff', '#123456')
 */
export const normalizeHex = (hex: string): string => {
  if (/^#[0-9A-Fa-f]{3}$/.test(hex)) {
    return (
      '#' +
      hex
        .slice(1)
        .split('')
        .map((x) => x + x)
        .join('')
    );
  }
  return hex;
};
