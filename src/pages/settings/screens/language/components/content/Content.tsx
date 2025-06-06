import { FC } from 'react';

import { LanguageContent } from '@/components';
import { SettingsSubScreenWrap } from '@/pages/settings/components';

export const Content: FC = () => {
  return (
    <SettingsSubScreenWrap>
      <LanguageContent />
    </SettingsSubScreenWrap>
  );
};
