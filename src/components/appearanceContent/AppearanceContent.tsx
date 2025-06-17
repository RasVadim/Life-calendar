import React, { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { SettingBlock } from '@/components/settingBlock/SettingBlock';
import { SettingsGroup } from '@/components/settingsGroup/SettingsGroup';
import { MoonIcon, SunIcon, StarIcon, PaletteIcon, RocketIcon } from '@/icons';
import { useThemeMode, useSetThemeMode } from '@/store/atoms';
import { EThemeMode } from '@/store/atoms/themeMode/atom';

import s from './s.module.styl';

export const AppearanceContent: FC = () => {
  const { t } = useTranslation();
  const [currentTheme] = useThemeMode();
  const setTheme = useSetThemeMode();

  const themes = [
    {
      mode: EThemeMode.DARK,
      icon: <MoonIcon />,
      title: t('layout.dark'),
      color: '#2A2A2A',
    },
    {
      mode: EThemeMode.LIGHT,
      icon: <SunIcon />,
      title: t('layout.light'),
      color: '#F5F5F5',
    },
    {
      mode: EThemeMode.EXPEREMENTAL,
      icon: <StarIcon />,
      title: t('layout.experimental'),
      color: '#6B4EFF',
    },
    {
      mode: EThemeMode.CUSTOM,
      icon: <PaletteIcon />,
      title: t('layout.custom'),
      color: '#FF6B6B',
    },
    {
      mode: EThemeMode.FUTURE,
      icon: <RocketIcon />,
      title: t('layout.future'),
      color: '#4CAF50',
    },
  ];

  return (
    <div className={s.wrapper}>
      <SettingsGroup>
        {themes.map((theme) => (
          <SettingBlock
            key={theme.mode}
            icon={theme.icon}
            title={theme.title}
            circleColor={theme.color}
            active={currentTheme === theme.mode}
            onClick={() => setTheme(theme.mode)}
            arrow={false}
          />
        ))}
      </SettingsGroup>
    </div>
  );
};
