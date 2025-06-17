import React, { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { SettingBlock, SettingsGroup } from '@/components';
import { THEMES } from '@/constants';
import { MoonIcon, SunIcon, StarIcon, PaletteIcon, RocketIcon } from '@/icons';
import { useThemeMode, useSetThemeMode } from '@/store/atoms';
import { EThemeMode } from '@/store/atoms';

import s from './s.module.styl';

// Generate themePreviews dynamically from THEMES and EThemeMode
const themePreviews = Object.values(EThemeMode).reduce(
  (acc, mode) => {
    const theme = THEMES[mode as unknown as keyof typeof THEMES];
    if (theme) {
      acc[mode as EThemeMode] = {
        primary: theme.primary,
        accent: theme.defaultWeekBg,
        background: theme.background,
      };
    }
    return acc;
  },
  {} as Record<EThemeMode, { primary: string; accent: string; background: string }>,
);

export const AppearanceContent: FC = () => {
  const { t } = useTranslation();
  const [currentTheme] = useThemeMode();
  const setTheme = useSetThemeMode();

  const themes = [
    {
      mode: EThemeMode.LIGHT,
      icon: <SunIcon />,
      title: t('layout.light'),
    },
    {
      mode: EThemeMode.DARK,
      icon: <MoonIcon />,
      title: t('layout.dark'),
    },
    {
      mode: EThemeMode.EXPEREMENTAL,
      icon: <StarIcon />,
      title: t('layout.experimental'),
    },
    {
      mode: EThemeMode.CUSTOM,
      icon: <PaletteIcon />,
      title: t('layout.custom'),
    },
    {
      mode: EThemeMode.FUTURE,
      icon: <RocketIcon />,
      title: t('layout.future'),
    },
  ];

  const carouselItems = themes.map((theme) => ({
    id: theme.mode,
    content: (
      <div className={s.themePreview} style={{ background: themePreviews[theme.mode].background }}>
        <span className={s.colorDot} style={{ background: themePreviews[theme.mode].primary }} />
        <span className={s.colorDot} style={{ background: themePreviews[theme.mode].accent }} />
        <span className={s.iconWrap}>{theme.icon}</span>
      </div>
    ),
    selected: currentTheme === theme.mode,
  }));

  const handleCarouselSelect = (id: string) => {
    setTheme(id as EThemeMode);
  };

  return (
    <div className={s.wrapper}>
      <SettingsGroup>
        <SettingBlock carouselItems={carouselItems} onCarouselSelect={handleCarouselSelect} />
      </SettingsGroup>
    </div>
  );
};
