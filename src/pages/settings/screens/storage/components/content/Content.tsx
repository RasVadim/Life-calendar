import { FC } from 'react';

import { StorageContent } from '@/components';
import { SettingsSubScreenWrap } from '@/pages/settings/components';

export const Content: FC = () => {
  return (
    <SettingsSubScreenWrap>
      <StorageContent />
    </SettingsSubScreenWrap>
  );
};
