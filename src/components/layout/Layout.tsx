import type { FC } from 'react';

import { Outlet } from 'react-router-dom';

import { Header, TabBar } from '@/components';
// import { LogsPanel } from '@/components/debug';

import s from './s.module.styl';

export const Layout: FC = () => {
  return (
    <div className={s.container}>
      <Header />
      <Outlet />
      <TabBar />
      {/* {import.meta.env.DEV && <LogsPanel />} */}
    </div>
  );
};
