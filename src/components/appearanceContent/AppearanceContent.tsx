import React, { FC } from 'react';

import { SettingBlock, SettingsGroup } from '@/components';
import { useThemeMode, useSetThemeMode } from '@/store/atoms';
import { EThemeMode } from '@/types';

import { ThemeCard, ThemePreview } from './components';

import s from './s.module.styl';

export const AppearanceContent: FC = () => {
  const [currentTheme] = useThemeMode();
  const setTheme = useSetThemeMode();

  const carouselItems = Object.values(EThemeMode).map((mode) => ({
    id: mode,
    content: <ThemeCard theme={mode} />,
    selected: currentTheme === mode,
  }));

  const handleCarouselSelect = (id: string) => {
    setTheme(id as EThemeMode);
  };

  return (
    <div className={s.wrapper}>
      <SettingsGroup>
        <SettingBlock
          carouselItems={carouselItems}
          expandedPreview={<ThemePreview />}
          onCarouselSelect={handleCarouselSelect}
        />
      </SettingsGroup>
    </div>
  );
};
