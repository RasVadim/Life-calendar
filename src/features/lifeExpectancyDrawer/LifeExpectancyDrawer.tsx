import { useTranslation } from 'react-i18next';

import { useSetOpenDrawerKey } from '@/store/atoms';
import { EModalKeys } from '@/types';
import { Drawer } from '@/ui-kit';

import { LifeExpectancyDrawerContent } from './components';

export const LifeExpectancyDrawer = () => {
  const { t } = useTranslation();

  const setDrawerKey = useSetOpenDrawerKey();

  const handleClose = () => {
    setDrawerKey(null);
  };

  return (
    <Drawer
      title={t('life.lifeInWeeks')}
      keyProp={EModalKeys.USER_LIFE_EXPECTANCY}
      onClose={handleClose}
    >
      <LifeExpectancyDrawerContent />
    </Drawer>
  );
};
