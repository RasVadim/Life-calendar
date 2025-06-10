import React from 'react';

import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { SettingBlock, SettingsGroup } from '@/components';
import { LANGUAGE_LABELS } from '@/constants';

import { Avatar } from './components';

import s from './s.module.styl';

export const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const languageLabel = LANGUAGE_LABELS[i18n.language] || i18n.language;

  return (
    <div className={s.wrapper}>
      <Avatar />
      <div className={s.blocks}>
        <SettingsGroup>
          <SettingBlock
            icon="👤"
            title={t('layout.myProfile')}
            circleColor="var(--profile-icon-color)"
            onClick={() => navigate('account')}
          />
        </SettingsGroup>
        <SettingsGroup>
          <SettingBlock
            icon="💾"
            title={t('layout.dataAndStorage')}
            circleColor="var(--storage-icon-color)"
            onClick={() => navigate('storage')}
          />
          <SettingBlock
            icon="🎨"
            title={t('layout.appearance')}
            circleColor="var(--appearance-icon-color)"
            onClick={() => navigate('appearance')}
          />
          <SettingBlock
            icon="🌐"
            title={t('layout.language')}
            circleColor="var(--language-icon-color)"
            rightText={languageLabel}
            onClick={() => navigate('language')}
          />
        </SettingsGroup>
        <SettingsGroup>
          <SettingBlock
            icon="⭐"
            title={t('layout.lcPremium')}
            circleColor="var(--premium-icon-color)"
            onClick={() => navigate('premium')}
          />
        </SettingsGroup>
        <SettingsGroup>
          <SettingBlock
            icon="ℹ️"
            title={t('layout.about')}
            circleColor="var(--about-icon-color)"
            onClick={() => navigate('about')}
          />
        </SettingsGroup>
      </div>
    </div>
  );
};
