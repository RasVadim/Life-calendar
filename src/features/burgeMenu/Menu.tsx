import { FC } from 'react';

import cx from 'classnames';

import { DRAWER_KEYS } from '@/constants/modal';
import { LanguageSwitcher, ThemeSwitcher } from '@/features';
import { useSetOpenDrawerKey } from '@/store/atoms';
import { Button } from '@/ui-kit';

import '../../styles/colors.styl';

import s from './s.module.styl';

type PropsType = {
  isOpen: boolean;
};

export const Menu: FC<PropsType> = ({ isOpen }) => {
  const setDrawerKey = useSetOpenDrawerKey();
  return (
    <div className={cx(s.menu, { [s.hidden]: !isOpen })}>
      <LanguageSwitcher />
      <ThemeSwitcher />
      <br />
      <Button label="button" icon="settings" />
      <br />
      <Button label="button" icon="settings" active />
      <br />
      <Button
        label="Open User Data Drawer"
        onClick={() => setDrawerKey(DRAWER_KEYS.userData)}
      />
    </div>
  );
};
