import React from 'react';

import { useNavigate } from 'react-router-dom';

import { SettingBlock, SettingsGroup } from '@/components';
import { LANGUAGE_LABELS, PAGE_NAMES } from '@/constants';
import { useTranslation } from '@/hooks';
import { SETTINGS_ICONS } from '@/icons';
import { ESettings } from '@/types';

import { Avatar } from './components';

import s from './s.module.styl';

export const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const languageLabel = LANGUAGE_LABELS[i18n.language] || i18n.language;

  const getIconColor = (iconName: string) => `var(--${iconName}-icon-color)`;

  return (
    <div className={s.wrapper}>
      <Avatar />
      <div className={s.blocks}>
        <SettingsGroup>
          <SettingBlock
            icon={<SETTINGS_ICONS.profile />}
            title={t('layout.myProfile')}
            circleColor={getIconColor(ESettings.PROFILE)}
            onClick={() => navigate(PAGE_NAMES.ACCOUNT)}
          />
        </SettingsGroup>
        <SettingsGroup>
          <SettingBlock
            icon={<SETTINGS_ICONS.storage />}
            title={t('layout.dataAndStorage')}
            circleColor={getIconColor(ESettings.STORAGE)}
            onClick={() => navigate(PAGE_NAMES.STORAGE)}
          />
          <SettingBlock
            icon={<SETTINGS_ICONS.appearance />}
            title={t('layout.appearance')}
            circleColor={getIconColor(ESettings.APPEARANCE)}
            onClick={() => navigate(PAGE_NAMES.APPEARANCE)}
          />
          <SettingBlock
            icon={<SETTINGS_ICONS.language />}
            title={t('layout.language')}
            circleColor={getIconColor(ESettings.LANGUAGE)}
            rightText={languageLabel}
            onClick={() => navigate(PAGE_NAMES.LANGUAGE)}
          />
        </SettingsGroup>
        <SettingsGroup>
          <SettingBlock
            icon={<SETTINGS_ICONS.premium />}
            title={t('layout.lcPremium')}
            circleColor={getIconColor(ESettings.PREMIUM)}
            onClick={() => navigate(PAGE_NAMES.PREMIUM)}
          />
        </SettingsGroup>
        <SettingsGroup>
          <SettingBlock
            icon={<SETTINGS_ICONS.about />}
            title={t('layout.about')}
            circleColor={getIconColor(ESettings.ABOUT)}
            onClick={() => navigate(PAGE_NAMES.ABOUT)}
          />
        </SettingsGroup>
      </div>
    </div>
  );
};
