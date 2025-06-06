import { useEffect, useRef, useLayoutEffect } from 'react';

import i18n from 'i18next';
import { useLocation } from 'react-router-dom';

import { Routes } from '@/Routes';
import {
  useLanguage,
  useThemeMode,
  useSetSyncPending,
  useSetPrevRoute,
} from '@/store/atoms';
import { initDefaultWeeks } from '@/store/clientDB';

import { toggleTheme } from './utils';

// Function to enter fullscreen
function enterFullscreen() {
  document.documentElement.requestFullscreen();
}

// Event listener for visibilitychange
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    enterFullscreen();
  }
});
const App = () => {
  const [language] = useLanguage();
  const [theme] = useThemeMode();
  const setPending = useSetSyncPending();

  const location = useLocation();

  const setPrevRoute = useSetPrevRoute();
  const prevPathRef = useRef(location.pathname);

  useLayoutEffect(() => {
    setPrevRoute(prevPathRef.current);
    prevPathRef.current = location.pathname;
  }, [location.pathname]);

  useEffect(() => {
    toggleTheme(theme);
  }, [theme]);

  useEffect(() => {
    // Setting language from local storage
    i18n.changeLanguage(language).then(() => {
      setPending(false);
    });
  }, [language]);

  useEffect(() => {
    // Initialize default weeks in background
    initDefaultWeeks();
  }, []);

  return <Routes prevPath={prevPathRef.current} />;
};

export default App;
