/**
 * Blends two RGB colors with the given alpha for the foreground color.
 * @param {number[]} bg - Background color as [r, g, b].
 * @param {number[]} fg - Foreground color as [r, g, b].
 * @param {number} alpha - Alpha value for the foreground color (0-1).
 * @returns {number[]} The resulting blended color as [r, g, b].
 */
export const blendColors = (bg: number[], fg: number[], alpha: number) => {
  return bg.map((c, i) => Math.round(fg[i] * alpha + c * (1 - alpha)));
};
