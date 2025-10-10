import { useEffect } from 'react';

export const useBodyScrollLock = (isOpen: boolean) => {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('fullscreen-open');
    }

    return () => {
      document.body.classList.remove('fullscreen-open');
    };
  }, [isOpen]);
};
