import { memo } from 'react';

import { Routes as OriginalRoutes, Route } from 'react-router-dom';

import { Layout } from './components';
import { PAGE_NAMES } from './constants/paths';
import {
  Life,
  Friends,
  Settings,
  MainSettingsScreen,
  Account,
  Storage,
  Appearance,
  Language,
  Premium,
  About,
} from './pages';

export interface RoutesProps {
  prevPath: string;
}

export const Routes = memo(({ prevPath }: RoutesProps) => {
  return (
    <OriginalRoutes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Life />} />
        <Route path={PAGE_NAMES.FRIENDS} element={<Friends />} />
        <Route path={PAGE_NAMES.SETTINGS} element={<Settings prevPath={prevPath} />}>
          <Route index element={<MainSettingsScreen />} />
          <Route path={PAGE_NAMES.ACCOUNT} element={<Account />} />
          <Route path={PAGE_NAMES.STORAGE} element={<Storage />} />
          <Route path={PAGE_NAMES.APPEARANCE} element={<Appearance />} />
          <Route path={PAGE_NAMES.LANGUAGE} element={<Language />} />
          <Route path={PAGE_NAMES.PREMIUM} element={<Premium />} />
          <Route path={PAGE_NAMES.ABOUT} element={<About />} />
        </Route>
        <Route path="*" element={<div>Need beautiful page</div>} />
      </Route>
    </OriginalRoutes>
  );
});
