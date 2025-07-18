import { FC } from 'react';

import cx from 'classnames';

import { YaerIconActions } from '@/components/appearanceContent/components/yaerIconActions/YaerIconActions';
import { LanguageSwitcher, ThemeSwitcher } from '@/features';
import { useSetOpenDrawerKey } from '@/store/atoms';
import { EModalKeys } from '@/types';
import { Button } from '@/ui-kit';

import s from './s.module.styl';

type PropsType = {
  isOpen: boolean;
};

export const Menu: FC<PropsType> = ({ isOpen }) => {
  const setDrawerKey = useSetOpenDrawerKey();

  return (
    <div className={cx(s.menu, { [s.hidden]: !isOpen })}>
      <div className={s.menu__content}>
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
      <YaerIconActions />
      <br />
      <Button
        label="Open User Data Drawer"
        active
        icon="settings"
        onClick={() => setDrawerKey(EModalKeys.USER_BIRTH_DATE)}
      />
      <br />
    </div>
  );
};
