import React, { FC } from 'react';

import { useTranslation } from 'react-i18next';

import { SettingBlock, SettingsGroup } from '@/components';
import { UserDataDrawer } from '@/features';
import { useSetOpenDrawerKey } from '@/store/atoms';
import { useDBUserData } from '@/store/clientDB';
import { EModalKeys } from '@/types';
import { getYearsWordDative } from '@/utils';

import s from './s.module.styl';

export const AccountContent: FC = () => {
  const { t, i18n } = useTranslation();

  const setDrawerKey = useSetOpenDrawerKey();

  const userData = useDBUserData();

  const handleBirthDateClick = () => {
    setDrawerKey(EModalKeys.USER_BIRTH_DATE);
  };
  const handleLifeSpanClick = () => {
    // Open modal/drawer to set life span
  };
  const handleDeathDateClick = () => {
    // Open modal/drawer to set death date
  };

  return (
    <div className={s.wrapper}>
      <SettingsGroup>
        <SettingBlock
          title={t('layout.birthDate')}
          onClick={handleBirthDateClick}
          rightText={userData?.birthDate || t('layout.setBirthDate')}
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
          rightText={t('layout.setDeathDate')}
          arrow={false}
          lessPadding
        />
      </SettingsGroup>
      <UserDataDrawer />
    </div>
  );
};
