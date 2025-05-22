import { FC, useRef, useState } from 'react';

import cx from 'classnames';

import { Menu } from './Menu';

import s from './s.module.styl';

export const BurgerMenu: FC = () => {
  // to change burger classes
  const [isOpen, setIsOpen] = useState(false);
  const firstOpen = useRef<boolean>(false);

  // toggle burger menu change
  const updateMenu = () => {
    if (firstOpen.current !== true) {
      firstOpen.current = true;
    }
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={s.wrapper}>
      <nav>
        <div className={s.menuButton} onClick={updateMenu}>
          <div className={cx(s.buttonStick, { [s.open]: isOpen })}></div>
          <div className={cx(s.buttonStick, { [s.open]: isOpen })}></div>
          <div className={cx(s.buttonStick, { [s.open]: isOpen })}></div>
        </div>
      </nav>

      {!!firstOpen.current && (
        <>
          <div
            className={cx(s.menuBackground, { [s.hidden]: !isOpen })}
            onClick={updateMenu}
          />
          <Menu isOpen={isOpen} />
        </>
      )}
    </div>
  );
};
