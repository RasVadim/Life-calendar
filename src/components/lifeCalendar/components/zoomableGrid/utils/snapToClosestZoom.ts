import { LIFE_GRID_ZOOM_LEVELS } from '@/constants';

export const SCROLL_THRESHOLD = 4; // minimum steps to advance to a new level

type TSnapToClosestZoomOptions = {
  currentCount: number;
  direction: 1 | -1;
  setColumns: React.Dispatch<React.SetStateAction<number>>;
  animationIntervalState: ReturnType<typeof setInterval> | null;
  onAnimationEnd?: () => void;
};

export const snapToClosestZoom = ({
  currentCount,
  direction,
  setColumns,
  animationIntervalState,
  onAnimationEnd,
}: TSnapToClosestZoomOptions) => {
  let closest = currentCount;
  let animationStep = 2;

  const zoomLevels = Object.values(LIFE_GRID_ZOOM_LEVELS);

  for (let i = 0; i < zoomLevels.length; i++) {
    const zoomLevel = zoomLevels[i];

    if (currentCount < zoomLevel) {
      const rightLevel = zoomLevel;
      const leftLevel = zoomLevels[i - 1] ?? zoomLevels[0];

      animationStep = Math.max(1, Math.floor((rightLevel - leftLevel) / 4));

      if (direction < 0) {
        // zoom +
        closest =
          rightLevel - SCROLL_THRESHOLD < currentCount ? rightLevel : leftLevel;
      } else {
        // zoom -
        closest =
          leftLevel + SCROLL_THRESHOLD > currentCount ? leftLevel : rightLevel;
      }

      break;
    }
  }

  if (animationIntervalState) {
    clearInterval(animationIntervalState);
  }

  animationIntervalState = setInterval(() => {
    setColumns((prev: number) => {
      if (prev === closest) {
        clearInterval(animationIntervalState!);
        onAnimationEnd?.();
        return prev;
      }
      const next = prev + (prev < closest ? animationStep : -animationStep);

      // borders
      if (
        (prev < closest && next > closest) ||
        (prev > closest && next < closest)
      ) {
        return closest;
      }

      return next;
    });
  }, 5); // animation speed — 5ms step
};
