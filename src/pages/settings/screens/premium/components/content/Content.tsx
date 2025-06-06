import { FC } from 'react';

import { PremiumContent } from '@/components';
import { SettingsSubScreenWrap } from '@/pages/settings/components';

export const Content: FC = () => {
  return (
    <SettingsSubScreenWrap>
      <PremiumContent />
    </SettingsSubScreenWrap>
  );
};
