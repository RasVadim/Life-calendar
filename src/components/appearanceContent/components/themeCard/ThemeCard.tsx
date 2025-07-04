import React, { FC } from 'react';

import { useTranslation } from '@/hooks';
import { ProfileIcon } from '@/icons';
import { EThemeMode } from '@/types';

import { themePalettes } from './helpers';

import s from './s.module.styl';

type TProps = {
  theme: EThemeMode;
};

export const ThemeCard: FC<TProps> = ({ theme }) => {
  const { t } = useTranslation();

  return (
    <div className={s.themeCard} style={{ background: themePalettes[theme].background }}>
      <div className={s.weeksColors}>
        <div className={s.palette}>
          <span
            className={s.colorWeek}
            style={{
              background: themePalettes[theme].newYear,
              borderColor: themePalettes[theme].weekPast,
            }}
          />
          <span
            className={s.colorWeek}
            style={{
              background: themePalettes[theme].feb23,
              borderColor: themePalettes[theme].weekPresent,
              boxShadow: `0 0 6px 2px ${themePalettes[theme].weekPresent}`,
            }}
          />
          <span
            className={s.colorWeek}
            style={{
              background: themePalettes[theme].mar8,
              borderColor: themePalettes[theme].weekFuture,
            }}
          />
        </div>
        <div className={s.palette}>
          <span
            className={s.colorWeek}
            style={{
              background: themePalettes[theme].birthday,
              borderColor: themePalettes[theme].primaryDark,
            }}
          />
          <span
            className={s.colorWeek}
            style={{
              background: themePalettes[theme].accent,
              borderColor: themePalettes[theme].oppositeContrast,
            }}
          />
          <span
            className={s.colorWeek}
            style={{
              background: themePalettes[theme].primaryLight,
              borderColor: themePalettes[theme].contrast,
            }}
          />
        </div>
      </div>

      {/* <span className={s.title}>{t(`layout.${theme}`)}</span> */}

      <div className={s.fakeTabBar} style={{ background: themePalettes[theme].backgroundFront }}>
        <div
          className={s.fakeNavButton}
          style={{
            background: `linear-gradient(to top right, ${themePalettes[theme].brandG1}, ${themePalettes[theme].brandG2})`,
            color: themePalettes[theme].contrast,
          }}
        >
          <ProfileIcon isActive />
          <span className={s.fakeNavButtonLabel} style={{ color: themePalettes[theme].contrast }}>
            {t('layout.settings')}
          </span>
        </div>
      </div>
    </div>
  );
};
