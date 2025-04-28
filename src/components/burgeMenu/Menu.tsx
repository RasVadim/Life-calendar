import { FC, useState } from 'react';
import {} from '../../styles/colors.styl';
import cx from 'classnames';

import { LanguageSwitcher, ThemeSwitcher } from '@/features';
import { Button } from '@/ui-kit';

import s from './s.module.styl';

type PropsType = {
  isOpen: boolean;
};

export const Menu: FC<PropsType> = ({ isOpen }) => {
  return (
    <div className={cx(s.menu, { [s.hidden]: !isOpen })}>
      <LanguageSwitcher />
      <br />
      <ThemeSwitcher />
      <br />
      <Button label="button" icon="settings" />
      <br />
      <Button label="button" icon="settings" active />
    </div>
  );
};
