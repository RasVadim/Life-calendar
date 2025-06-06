import { FC } from 'react';

import { AccountContent } from '@/components';
import { SettingsSubScreenWrap } from '@/pages/settings/components';

export const Content: FC = () => {
  return (
    <SettingsSubScreenWrap>
      <AccountContent />
    </SettingsSubScreenWrap>
  );
};
