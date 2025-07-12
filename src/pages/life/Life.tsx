import { lazy, FC, ReactNode, useEffect } from 'react';

import { PAGE_NAMES } from '@/constants/paths';
import { useSetOpenDrawerKey } from '@/store/atoms';
import { lifeCalendarDB } from '@/store/clientDB';
import { EModalKeys } from '@/types';
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
        if (!userData || !userData.birthDate) {
          setDrawerKey(EModalKeys.USER_BIRTH_DATE);
        }
      } catch (e) {
        setDrawerKey(EModalKeys.USER_BIRTH_DATE); // If there is an error, open the drawer
      }
    };
    checkBirthDate();
  }, [setDrawerKey]);

  return (
    <Page name={PAGE_NAMES.LIFE}>
      <LazyContent />
    </Page>
  );
};
