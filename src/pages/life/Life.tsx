import { lazy, FC, ReactNode } from 'react';

import { Page } from '@/ui-kit';

const LazyContent = lazy(() => import('../../components/content/Content'));

type PropsType = {
  children?: ReactNode;
};

export const Life: FC<PropsType> = () => {
  return (
    <Page name="life">
      <LazyContent />
    </Page>
  );
};
