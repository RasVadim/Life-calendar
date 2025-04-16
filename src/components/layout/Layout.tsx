import type { FC } from 'react';
import { Outlet } from 'react-router-dom';

import { Header, TabBar } from '@/components';
import { LogsPanel } from '@/components/debug';

import s from './s.module.styl';

type PropsType = {};

export const Layout: FC<PropsType> = () => {
  return (
    <div className={s.container}>
      <Header />
      <Outlet />
      <TabBar />
      {import.meta.env.DEV && <LogsPanel />}
    </div>
  );
};
