import { FC } from 'react';

import { useConsoleLogger } from '@/hooks/debug';

import s from './s.module.styl';
import { useDevice } from '@/hooks';

export const LogsPanel: FC = () => {
  const logs = useConsoleLogger();
  const { isDesktop } = useDevice();

  if (isDesktop) return null;

  return (
    <div className={s.logsPanel}>
      {logs.map((log, i) => (
        <div key={i}>{log}</div>
      ))}
    </div>
  );
};
