import { lazy, FC, ReactNode, useEffect } from 'react';

import { DRAWER_KEYS } from '@/constants/modal';
import { UserDataDrawer } from '@/features';
import { useSetOpenDrawerKey } from '@/store/atoms';
import { lifeCalendarDB } from '@/store/clientDB';
import { Page } from '@/ui-kit';

const LazyContent = lazy(() => import('./components/content/Content'));

type PropsType = {
  children?: ReactNode;
};

export const Life: FC<PropsType> = () => {
  const setDrawerKey = useSetOpenDrawerKey();

  useEffect(() => {
    // Check if the birth date exists in the database
    const checkBirthDate = async () => {
      try {
        const userData = await lifeCalendarDB.userData.get('main');
        console.log('userData', userData);
        if (!userData || !userData.birthDate) {
          setDrawerKey(DRAWER_KEYS.userData);
        }
      } catch (e) {
        setDrawerKey(DRAWER_KEYS.userData); // If there is an error, open the drawer
      }
    };
    checkBirthDate();
  }, [setDrawerKey]);

  return (
    <Page name="life">
      <LazyContent />
      <UserDataDrawer />
    </Page>
  );
};
