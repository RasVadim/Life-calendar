import { Application, Container } from 'pixi.js';

type TGetHandleWheelOptions = {
  lifeMode: string;
  scrollContainer: Container | null;
  app: Application | null;
};

export const getHandleWheel = ({ lifeMode, scrollContainer, app }: TGetHandleWheelOptions) => {
  const handleWheel = (e: WheelEvent) => {
    if (lifeMode !== 'seasons') return;
    if (!scrollContainer) return;
    e.preventDefault();
    scrollContainer.y -= e.deltaY;
    // Scroll constraints
    const minY = Math.min(0, (app?.renderer.height || 0) - scrollContainer.height);
    if (scrollContainer.y > 0) scrollContainer.y = 0;
    if (scrollContainer.y < minY) scrollContainer.y = minY;
  };
  return handleWheel;
};
