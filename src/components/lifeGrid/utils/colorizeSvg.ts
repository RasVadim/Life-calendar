import { GraphicsContext } from 'pixi.js';

export const colorizeSvg = (svgContext: GraphicsContext, primaryColor: number): GraphicsContext => {
  // Change color in all instructions (paths)
  svgContext.instructions.forEach((instruction) => {
    if (
      instruction.data?.style &&
      typeof instruction.data.style === 'object' &&
      'color' in instruction.data.style
    ) {
      (instruction.data.style as { color: number }).color = primaryColor;
    }
  });
  return svgContext;
};
