import { FC } from 'react';

import { AppearanceContent } from '@/components';
import { SettingsSubScreenWrap } from '@/pages/settings/components';

export const Content: FC = () => {
  return (
    <SettingsSubScreenWrap>
      <AppearanceContent />
    </SettingsSubScreenWrap>
  );
};
