import { useEffect } from 'react';

export const useBrowserZoom = (enabled: boolean) => {
  useEffect(() => {
    const viewport = document.querySelector('meta[name="viewport"]');

    if (!viewport) {
      console.warn('Viewport meta tag not found');
      return;
    }

    const originalContent = viewport.getAttribute('content');

    if (enabled) {
      // Enable browser zoom for fullscreen media
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes',
      );
    } else {
      // Disable browser zoom (restore original)
      viewport.setAttribute(
        'content',
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
      );
    }

    return () => {
      // Restore original viewport settings
      if (originalContent) {
        viewport.setAttribute('content', originalContent);
      }
    };
  }, [enabled]);
};
