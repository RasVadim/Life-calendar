import { LIFE_GRID_ZOOM_LEVELS } from '@/constants';

export const SCROLL_THRESHOLD = 3; // minimum steps to advance to a new level
export const ANIMATION_STEP = 1; // minimal quantity of columns for one step of animation

type TSnapToClosestZoomOptions = {
  currentCount: number;
  direction: 1 | -1;
  setColumns: React.Dispatch<React.SetStateAction<number>>;
  onAnimationEnd?: () => void;
};

export const snapToClosestZoom = ({
  currentCount,
  direction,
  setColumns,
  onAnimationEnd,
}: TSnapToClosestZoomOptions) => {
  let closest = currentCount;
  let animationStep = ANIMATION_STEP;

  const zoomLevels = Object.values(LIFE_GRID_ZOOM_LEVELS);

  for (let i = 0; i < zoomLevels.length; i++) {
    const zoomLevel = zoomLevels[i];

    if (currentCount < zoomLevel) {
      const rightLevel = zoomLevel;
      const leftLevel = zoomLevels[i - 1] ?? zoomLevels[0];

      animationStep = Math.max(1, Math.floor((rightLevel - leftLevel) / 4));

      if (direction < 0) {
        // zoom +
        closest = rightLevel - SCROLL_THRESHOLD < currentCount ? rightLevel : leftLevel;
      } else {
        // zoom -
        closest = leftLevel + SCROLL_THRESHOLD > currentCount ? leftLevel : rightLevel;
      }

      break;
    }
  }

  let frameId: number | null = null;
  function animate() {
    setColumns((prev: number) => {
      if (prev === closest) {
        if (frameId) cancelAnimationFrame(frameId);
        onAnimationEnd?.();
        return prev;
      }
      let next: number;
      if (Math.abs(prev - closest) < animationStep) {
        next = closest;
      } else {
        next = prev + (prev < closest ? animationStep : -animationStep);
      }
      frameId = requestAnimationFrame(animate);
      return next;
    });
  }

  frameId = requestAnimationFrame(animate);
};
