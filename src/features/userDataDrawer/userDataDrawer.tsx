import { DRAWER_KEYS } from '@/constants/modal';
import { useSetOpenDrawerKey } from '@/store/atoms';
import { Drawer } from '@/ui-kit';

export const UserDataDrawer = () => {
  const setDrawerKey = useSetOpenDrawerKey();

  return (
    <Drawer keyProp={DRAWER_KEYS.userData} onClose={() => setDrawerKey(null)}>
      Drawer content here
    </Drawer>
  );
};
