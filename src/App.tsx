import { useEffect, useRef, useLayoutEffect } from 'react';

import { useLocation } from 'react-router-dom';

import { useInitLanguage } from '@/hooks';
import { Routes } from '@/Routes';
import { useThemeMode, useSetPrevRoute } from '@/store/atoms';
import { initDefaultWeeks } from '@/store/clientDB';

import { BirthDateDrawer } from './features';
import { toggleTheme } from './utils';

// Function to enter fullscreen
function enterFullscreen() {
  document.documentElement.requestFullscreen();
}

// Event listener for visibilitychange
// When the page becomes visible, enter fullscreen mode
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    enterFullscreen();
  }
});

const App = () => {
  const [theme] = useThemeMode();

  const location = useLocation();
  const setPrevRoute = useSetPrevRoute();
  const prevPathRef = useRef(location.pathname);

  // Initialize language
  useInitLanguage();

  // Initialize theme
  useEffect(() => {
    // Apply theme changes
    toggleTheme(theme);
  }, [theme]);

  // Save previous route for navigation purposes
  useLayoutEffect(() => {
    setPrevRoute(prevPathRef.current);
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  // Initialize default weeks in background
  useEffect(() => {
    initDefaultWeeks();
  }, []);

  return (
    <>
      <Routes prevPath={prevPathRef.current} />
      <BirthDateDrawer />
    </>
  );
};

export default App;
