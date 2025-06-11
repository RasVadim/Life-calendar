import { FC, useRef, useState, useEffect } from 'react';

import cx from 'classnames';
import { useNavigate } from 'react-router-dom';

import { Menu } from '../menu/Menu';

import s from './s.module.styl';

interface BurgerMenuProps {
  backButton?: boolean;
  onBack?: () => void;
}

export const BurgerMenuButton: FC<BurgerMenuProps> = ({ backButton = false, onBack }) => {
  const navigate = useNavigate();

  // to change burger classes
  const [isOpen, setIsOpen] = useState(false);
  const firstOpen = useRef<boolean>(false);

  // Reset menu state when switching to back button mode
  useEffect(() => {
    if (backButton) {
      setIsOpen(false);
      firstOpen.current = false;
    }
  }, [backButton]);

  // toggle burger menu change
  const updateMenu = () => {
    if (firstOpen.current !== true) {
      firstOpen.current = true;
    }
    setIsOpen((prev) => !prev);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    }
    navigate(-1);
  };

  const handleClick = backButton ? handleBack : updateMenu;

  return (
    <div className={s.wrapper}>
      <nav>
        <div className={s.menuButton} onClick={handleClick}>
          <div className={cx(s.buttonStick, { [s.open]: isOpen, [s.back]: backButton })}></div>
          <div className={cx(s.buttonStick, { [s.open]: isOpen, [s.back]: backButton })}></div>
          <div className={cx(s.buttonStick, { [s.open]: isOpen, [s.back]: backButton })}></div>
        </div>
      </nav>

      {!backButton && !!firstOpen.current && (
        <>
          <div className={cx(s.menuBackground, { [s.hidden]: !isOpen })} onClick={updateMenu} />
          <Menu isOpen={isOpen} />
        </>
      )}
    </div>
  );
};
