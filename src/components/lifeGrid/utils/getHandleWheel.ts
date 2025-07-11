import { Application, Container } from 'pixi.js';

type TGetHandleWheelOptions = {
  lifeMode: string;
  scrollContainerRef: React.RefObject<Container>;
  appRef: React.RefObject<Application>;
};

export const getHandleWheel = ({
  lifeMode,
  scrollContainerRef,
  appRef,
}: TGetHandleWheelOptions) => {
  const handleWheel = (e: WheelEvent) => {
    if (lifeMode !== 'seasons') return;
    if (!scrollContainerRef.current) return;
    e.preventDefault();
    scrollContainerRef.current.y -= e.deltaY;
    // Scroll constraints
    const minY = Math.min(0, appRef.current!.renderer.height - scrollContainerRef.current.height);
    if (scrollContainerRef.current.y > 0) scrollContainerRef.current.y = 0;
    if (scrollContainerRef.current.y < minY) scrollContainerRef.current.y = minY;
  };
  return handleWheel;
};
