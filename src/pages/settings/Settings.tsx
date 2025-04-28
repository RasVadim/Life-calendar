import { lazy, FC, ReactNode } from 'react';

import { Page } from '@/ui-kit';

const LazyContent = lazy(() => import('../../components/content/Content'));

type PropsType = {
  children?: ReactNode;
};

export const Settings: FC<PropsType> = () => {
  return (
    <Page name="Settings">
      <LazyContent />
    </Page>
  );
};
