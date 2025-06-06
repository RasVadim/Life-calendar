import { memo } from 'react';

import { Routes as OriginalRoutes, Route } from 'react-router-dom';

import { Layout } from './components';
import {
  Life,
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
        <Route path="settings" element={<Settings prevPath={prevPath} />}>
          <Route index element={<MainSettingsScreen />} />
          <Route path="account" element={<Account />} />
          <Route path="storage" element={<Storage />} />
          <Route path="appearance" element={<Appearance />} />
          <Route path="language" element={<Language />} />
          <Route path="premium" element={<Premium />} />
          <Route path="about" element={<About />} />
        </Route>
        <Route path="*" element={<div>Need beautiful page</div>} />
      </Route>
    </OriginalRoutes>
  );
});
