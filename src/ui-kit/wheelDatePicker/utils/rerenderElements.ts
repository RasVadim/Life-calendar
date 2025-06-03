import type { TItem } from './generateYearItems';

export const rerenderElements = (
  refs: React.MutableRefObject<(HTMLLIElement | null)[]>,
  items: TItem[],
  selectedElement: number,
  scrollTop: number,
  itemHeight: number,
  maxScrollOffset: number,
  offset: number,
  origin: 'left' | 'center' | 'right',
  firstItemIndex = Math.max(selectedElement - offset, 0),
  lastItemIndex = Math.min(selectedElement + offset, items.length),
) => {
  if (refs.current) {
    refs.current.slice(firstItemIndex, lastItemIndex).forEach((item, index) => {
      const realIndex = index + firstItemIndex;
      const scrollOffset = Math.min(
        Math.abs(scrollTop - realIndex * itemHeight - itemHeight / 2),
        maxScrollOffset,
      );
      const sin = scrollOffset / maxScrollOffset;
      const cos = Math.sqrt(1 - sin ** 2);
      if (item) {
        const div = item.getElementsByTagName('div')[0];
        if (div) {
          div.style.transform = `rotateX(${Math.asin(sin)}rad) scale(${cos})`;
          div.style.transformOrigin = origin;
        }
      }
    });
  }
};
