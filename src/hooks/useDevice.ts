import { useEffect, useState } from 'react';

import { DEVICE_SCREEN_WIDTH } from '@/constants';

export const useDevice = () => {
  const getDevice = () => {
    const width = window.innerWidth;
    return {
      isMobile: width < DEVICE_SCREEN_WIDTH.mobile,
      isMedium: width < DEVICE_SCREEN_WIDTH.medium,
      isTablet: width >= DEVICE_SCREEN_WIDTH.mobile && width < DEVICE_SCREEN_WIDTH.tablet,
      isDesktop: width >= DEVICE_SCREEN_WIDTH.tablet,
      isTouchScreen: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    };
  };

  const [device, setDevice] = useState(getDevice);

  useEffect(() => {
    const handleResize = () => {
      setDevice(getDevice());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return device;
};
