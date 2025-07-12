import React, { useRef, useEffect } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';

import { PAGE_NAMES } from '@/constants/paths';
import { getDepth } from '@/utils';

import { MainSettingsScreen } from './components';
import { PAGE_ANIMATION_VARIANTS } from './constants/animation';
import { About, Account, Appearance, Language, Premium, Storage } from './screens';

import s from './s.module.styl';

interface SettingsProps {
  prevPath: string;
}

export const Settings: React.FC<SettingsProps> = ({ prevPath }) => {
  const location = useLocation();

  const isFirstMountRef = useRef(true);
  useEffect(() => {
    isFirstMountRef.current = false;
  }, []);

  const isFirstEntry = isFirstMountRef.current || !prevPath || !prevPath.startsWith('/settings');

  const prevDepth = getDepth(prevPath || '');
  const currentDepth = getDepth(location.pathname);
  const direction = currentDepth > prevDepth ? 1 : -1;

  const variants = PAGE_ANIMATION_VARIANTS;

  return (
    <AnimatePresence mode="sync" custom={{ direction, isFirstEntry }}>
      <motion.div
        key={location.key || location.pathname}
        custom={{ direction, isFirstEntry }}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.35 }}
        className={s.motionWrap}
      >
        <Routes location={location} key={location.key || location.pathname}>
          <Route path={PAGE_NAMES.ACCOUNT} element={<Account />} />
          <Route path={PAGE_NAMES.STORAGE} element={<Storage />} />
          <Route path={PAGE_NAMES.APPEARANCE} element={<Appearance />} />
          <Route path={PAGE_NAMES.LANGUAGE} element={<Language />} />
          <Route path={PAGE_NAMES.PREMIUM} element={<Premium />} />
          <Route path={PAGE_NAMES.ABOUT} element={<About />} />
          <Route path="*" element={<MainSettingsScreen />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};
