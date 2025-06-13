import React from 'react';

import { useTranslation } from 'react-i18next';

import { SettingBlock } from '@/components/settingBlock/SettingBlock';
import { SettingsGroup } from '@/components/settingsGroup/SettingsGroup';
import { LANGUAGES } from '@/constants';
import { TLanguage, useSetLanguage } from '@/store/atoms';

import s from './s.module.styl';

export const LanguageContent: React.FC = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language;
  const setLang = useSetLanguage();

  const handleChange = (code: string) => {
    if (code !== currentLang) {
      setLang(code as TLanguage);
    }
  };

  return (
    <div className={s.wrapper}>
      <SettingsGroup>
        {LANGUAGES.map((lang) => (
          <SettingBlock
            key={lang.code}
            title={lang.label}
            rightText={lang.native}
            onClick={lang.enabled ? () => handleChange(lang.code) : undefined}
            disabled={!lang.enabled}
            active={lang.code === currentLang}
            arrow={false}
            thinText
          />
        ))}
      </SettingsGroup>
    </div>
  );
};
