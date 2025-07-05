import { FC } from 'react';

import { SettingBlock, SettingsGroup } from '@/components';
import { useTranslation } from '@/hooks';
import { useThemeMode, useSetThemeMode } from '@/store/atoms';
import { useDBSettings } from '@/store/clientDB';
import { EThemeMode } from '@/types';

import { ThemeCard, ThemePreview, YaerIconActions } from './components';

import s from './s.module.styl';

export const AppearanceContent: FC = () => {
  const { t } = useTranslation();
  const [currentTheme] = useThemeMode();
  const setTheme = useSetThemeMode();

  const settings = useDBSettings();

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

      <SettingsGroup>
        <SettingBlock
          title={t('layout.yearIcons')}
          rightText={t(`layout.${settings?.zodiacMode}`)}
          expandedPreview={<YaerIconActions />}
          arrow={false}
          unclickable
        />
      </SettingsGroup>
    </div>
  );
};
