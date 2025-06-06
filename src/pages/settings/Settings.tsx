import { AnimatePresence, motion } from 'framer-motion';
import { Routes, Route, useLocation } from 'react-router-dom';

import About from './screens/about/About';
import Account from './screens/account/Account';
import Appearance from './screens/appearance/Appearance';
import Content from './components/content/Content';
import Language from './screens/language/Language';
import Premium from './screens/premium/Premium';
import Storage from './screens/storage/Storage';

const getDepth = (pathname: string) =>
  pathname.split('/').filter(Boolean).length;

const pageVariants = {
  initial: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  animate: { x: 0, opacity: 1 },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0,
  }),
};

const fadeVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

interface SettingsProps {
  prevPath: string;
}

export default function Settings({ prevPath }: SettingsProps) {
  const location = useLocation();

  const isFirstEntry =
    location.pathname === '/settings' &&
    (!prevPath ||
      (!prevPath.startsWith('/settings') && !prevPath.startsWith('/')));

  const prevDepth = getDepth(prevPath || '');
  const currentDepth = getDepth(location.pathname);
  const direction = currentDepth > prevDepth ? 1 : -1;

  const variants = isFirstEntry ? fadeVariants : pageVariants;


  return (
    <AnimatePresence mode="sync" custom={direction}>
      <motion.div
        key={location.key || location.pathname}
        custom={direction}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.35 }}
        style={{ height: '100%', position: 'absolute', width: '100%', top: 50, left: 0 }}
      >
        <Routes location={location} key={location.key || location.pathname}>
          <Route path="account" element={<Account />} />
          <Route path="storage" element={<Storage />} />
          <Route path="appearance" element={<Appearance />} />
          <Route path="language" element={<Language />} />
          <Route path="premium" element={<Premium />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<Content />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
