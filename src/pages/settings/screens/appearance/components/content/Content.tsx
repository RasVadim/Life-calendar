import { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { SettingsSubScreenWrap } from '@/pages/settings/components';

export const Content: FC = () => {
  const { t } = useTranslation();
  return (
    <SettingsSubScreenWrap>
      {t('layout.appearance')}
    </SettingsSubScreenWrap>
  );
};
