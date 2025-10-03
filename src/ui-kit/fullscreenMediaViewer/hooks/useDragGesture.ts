import { useCallback, useRef, useState } from 'react';

// Constants for better performance
const RESISTANCE = 0.3;
const SWIPE_THRESHOLD = 100;

export const useDragGesture = (isOpen: boolean, onClose: () => void) => {
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const startTouchRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!isOpen) return;

      const touch = e.touches[0];
      startTouchRef.current = { x: touch.clientX, y: touch.clientY };
      setIsDragging(true);
      setDragOffset({ x: 0, y: 0 });
    },
    [isOpen],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isOpen || !startTouchRef.current || !isDragging) return;

      e.preventDefault();

      const touch = e.touches[0];
      const deltaX = touch.clientX - startTouchRef.current.x;
      const deltaY = touch.clientY - startTouchRef.current.y;

      const adjustedDeltaX = deltaX * RESISTANCE;
      setDragOffset({ x: adjustedDeltaX, y: deltaY });
    },
    [isOpen, isDragging],
  );

  const handleTouchEnd = useCallback(() => {
    if (!isOpen || !isDragging) return;

    setIsDragging(false);

    if (dragOffset.y > SWIPE_THRESHOLD) {
      onClose();
    } else {
      setDragOffset({ x: 0, y: 0 });
    }

    startTouchRef.current = null;
  }, [isOpen, isDragging, dragOffset.y, onClose]);

  const resetDrag = useCallback(() => {
    setDragOffset({ x: 0, y: 0 });
  }, []);

  return {
    dragOffset,
    isDragging,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    resetDrag,
  };
};
