import { memo } from 'react';

import { Routes as OriginalRoutes, Route } from 'react-router-dom';

import { Layout } from './components';
import { Life, Settings } from './pages';

export const Routes = memo(() => {
  return (
    <OriginalRoutes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Life />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<div>Need beautiful page</div>} />
      </Route>
    </OriginalRoutes>
  );
});
