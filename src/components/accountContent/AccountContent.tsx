import React, { FC } from 'react';

import { SettingBlock, SettingsGroup } from '@/components';
import { LifeExpectancyDrawer } from '@/features';
import { useTranslation } from '@/hooks';
import { useSetOpenDrawerKey } from '@/store/atoms';
import { useDBUserData } from '@/store/clientDB';
import { EModalKeys } from '@/types';
import { formatDateToUI, getYearsWordDative } from '@/utils';

import s from './s.module.styl';

export const AccountContent: FC = () => {
  const { t, i18n } = useTranslation();

  const setDrawerKey = useSetOpenDrawerKey();

  const userData = useDBUserData();

  const handleBirthDateClick = () => {
    setDrawerKey(EModalKeys.USER_BIRTH_DATE);
  };
  const handleLifeSpanClick = () => {
    setDrawerKey(EModalKeys.USER_LIFE_EXPECTANCY);
  };
  const handleDeathDateClick = () => {
    setDrawerKey(EModalKeys.USER_LIFE_EXPECTANCY);
  };

  return (
    <div className={s.wrapper}>
      <SettingsGroup>
        <SettingBlock
          title={t('layout.birthDate')}
          onClick={handleBirthDateClick}
          rightText={formatDateToUI(userData?.birthDate, t('layout.setBirthDate'))}
          arrow={false}
          lessPadding
        />
      </SettingsGroup>
      <SettingsGroup>
        <SettingBlock
          title={t('layout.lifeSpan')}
          onClick={handleLifeSpanClick}
          rightText={
            userData?.lifeExpectancy
              ? `${userData.lifeExpectancy} ${getYearsWordDative(userData.lifeExpectancy, i18n.language)}`
              : t('layout.setLifeSpan')
          }
          arrow={false}
          lessPadding
        />
        <SettingBlock
          title={t('layout.deathDate')}
          onClick={handleDeathDateClick}
          rightText={formatDateToUI(userData?.deathDate, t('layout.setDeathDate'))}
          arrow={false}
          lessPadding
        />
      </SettingsGroup>
      <LifeExpectancyDrawer />
    </div>
  );
};
