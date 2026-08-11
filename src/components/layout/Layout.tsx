import type { FC } from 'react';

import { Outlet } from 'react-router-dom';

import { Header, TabBar } from '@/components';
// import { LogsPanel } from '@/components/debug';

export const Layout: FC = () => {
  return (
    <>
      <Header />
      <Outlet />
      <TabBar />
      {/* {import.meta.env.DEV && <LogsPanel />} */}
    </>
  );
};
