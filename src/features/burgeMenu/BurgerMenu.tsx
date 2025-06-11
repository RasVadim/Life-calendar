import { FC } from 'react';

import { BurgerMenuButton } from './burgerMenuButton/BurgerMenuButton';

interface BurgerMenuProps {
  backButton?: boolean;
  onBack?: () => void;
}

export const BurgerMenu: FC<BurgerMenuProps> = ({ backButton = false, onBack }) => {
  return <BurgerMenuButton backButton={backButton} onBack={onBack} />;
};
