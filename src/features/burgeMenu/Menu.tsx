import { FC } from 'react';

import cx from 'classnames';

import { LanguageSwitcher, ThemeSwitcher } from '@/features';
import { Button } from '@/ui-kit';

import '../../styles/colors.styl';
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
