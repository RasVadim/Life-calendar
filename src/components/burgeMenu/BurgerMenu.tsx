import { FC, useState } from "react";
import cx from "classnames";

import s from "./s.module.styl";

type PropsType = {};

export const BurgerMenu: FC<PropsType> = () => {
  // to change burger classes
  const [isOpen, setIsOpen] = useState(false);

  // const [burger_class, setBurgerClass] = useState("burger-bar unclicked");
  // const [menu_class, setMenuClass] = useState("menu hidden");
  // const [isMenuClicked, setIsMenuClicked] = useState(false);

  // toggle burger menu change
  const updateMenu = () => {
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

      <div className={cx(s.menu, { [s.hidden]: !isOpen })}></div>
    </div>
  );
};
