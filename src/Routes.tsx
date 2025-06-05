import { memo } from 'react';

import { Routes as OriginalRoutes, Route } from 'react-router-dom';

import { Layout } from './components';
import {
  Life,
  Settings,
  Account,
  Storage,
  Appearance,
  Language,
  Premium,
  About,
} from './pages';
import Content from './pages/settings/components/content/Content';

export const Routes = memo(() => {
  return (
    <OriginalRoutes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Life />} />
        <Route path="settings" element={<Settings />}>
          <Route index element={<Content />} />
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
