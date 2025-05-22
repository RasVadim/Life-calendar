import { lazy, FC, ReactNode } from 'react';

import { DRAWER_KEYS } from '@/constants/modal';
import { UserDataDrawer } from '@/features';
import { useSetOpenDrawerKey } from '@/store/atoms';
import { Page } from '@/ui-kit';


const LazyContent = lazy(() => import('./components/content/Content'));

type PropsType = {
  children?: ReactNode;
};

export const Life: FC<PropsType> = () => {
  const setDrawerKey = useSetOpenDrawerKey();

  return (
    <Page name="life">
      <button
        style={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 110,
        }}
        onClick={() => setDrawerKey(DRAWER_KEYS.userData)}
      >
        Open Drawer
      </button>
      <LazyContent />
      <UserDataDrawer />
    </Page>
  );
};
