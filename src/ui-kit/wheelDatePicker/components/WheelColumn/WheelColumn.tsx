import React, { useEffect, useRef, useMemo } from 'react';

import { TItem, rerenderElements } from '../../utils';

import s from './s.module.styl';

const SCROLL_DEBOUNCE_TIME = 20;

type WheelColumnProps = {
  items: TItem[];
  value: string | number;
  onChange: (value: string | number) => void;
  origin: 'left' | 'center' | 'right';
  itemHeight: number;
  containerHeight: number;
};

export const WheelColumn: React.FC<WheelColumnProps> = ({
  items,
  value,
  onChange,
  origin,
  itemHeight,
  containerHeight,
}) => {
  const itemsContRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const itemsMap = useMemo(
    () =>
      items.reduce(
        (map, item, index) => map.set(item.value, index),
        new Map<string | number, number>(),
      ),
    [items],
  );
  const currentValue = useRef<number>(itemsMap.get(value) ?? 0);
  const visibleItemsCount = Math.floor(containerHeight / itemHeight);
  const offset = Math.round((visibleItemsCount + 1) / 2) + 1;
  const maxScrollOffset = (containerHeight - itemHeight) / 2;
  const isScrolling = useRef<NodeJS.Timeout | null>(null);
  const isProgrammaticScroll = useRef(false);

  useEffect(() => {
    let isAnimating = false;
    function handleScroll(event: Event) {
      if (isProgrammaticScroll.current) {
        isProgrammaticScroll.current = false;
        return;
      }
      if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(() => {
          const target = event.target as HTMLUListElement;
          const scrollTop = Math.max(target.scrollTop, 0);
          const selectedElement = Math.min(
            Math.max(Math.floor(scrollTop / itemHeight), 0),
            items.length - 1,
          );
          if (isScrolling.current) window.clearTimeout(isScrolling.current);
          rerenderElements(
            itemRefs,
            items,
            selectedElement,
            scrollTop,
            itemHeight,
            maxScrollOffset,
            offset,
            origin,
          );
          currentValue.current = selectedElement;
          isScrolling.current = setTimeout(function () {
            onChange(items[selectedElement].value);
          }, SCROLL_DEBOUNCE_TIME);
          isAnimating = false;
        });
      }
    }
    const container = itemsContRef.current;
    container?.addEventListener('scroll', handleScroll);
    if (itemRefs.current[currentValue.current]) {
      isProgrammaticScroll.current = true;
      itemRefs.current[currentValue.current]?.scrollIntoView({
        block: 'center',
      });
    }
    rerenderElements(
      itemRefs,
      items,
      currentValue.current,
      container?.scrollTop ?? 0,
      itemHeight,
      maxScrollOffset,
      offset,
      origin,
      0,
      items.length,
    );
    return () => {
      container?.removeEventListener('scroll', handleScroll);
    };
  }, [itemsContRef.current]);

  useEffect(() => {
    const index = itemsMap.get(value);
    if (index !== undefined && index !== currentValue.current) {
      currentValue.current = index;
      isProgrammaticScroll.current = true;
      itemRefs.current[index]?.scrollIntoView({
        block: 'center',
        behavior: 'smooth',
      });
      rerenderElements(
        itemRefs,
        items,
        currentValue.current,
        itemsContRef.current?.scrollTop ?? 0,
        itemHeight,
        maxScrollOffset,
        offset,
        origin,
        0,
        items.length,
      );
    }
  }, [value]);

  return (
    <ul className={s.items} ref={itemsContRef}>
      {items.map((item, index) => (
        <li
          className={s.item}
          key={item.value}
          ref={(node) => (itemRefs.current[index] = node)}
          style={{ height: `${itemHeight}px`, lineHeight: `${itemHeight}px` }}
        >
          <div>{item.label}</div>
        </li>
      ))}
    </ul>
  );
};
