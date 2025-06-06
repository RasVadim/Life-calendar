import { FC } from 'react';

import { AboutContent } from '@/components';
import { SettingsSubScreenWrap } from '@/pages/settings/components';

export const Content: FC = () => {
  return (
    <SettingsSubScreenWrap>
      <AboutContent />
    </SettingsSubScreenWrap>
  );
};
