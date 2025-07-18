import { FC } from 'react';

import { LIFE_MODES } from '@/constants';
import {
  BackIcon,
  HouseIcon,
  MenuIcon,
  MonthsIcon,
  PartOfLifeIcon,
  ProfileIcon,
  SeasonsIcon,
  YearsIcon,
} from '@/icons';

type TBaseIconName = 'menu' | 'back' | 'life' | 'settings' | 'friends';
export type TIconName = TBaseIconName | (typeof LIFE_MODES)[keyof typeof LIFE_MODES];

export type TIconProps = {
  isActive?: boolean;
};

export const BUTTON_ICONS: Record<TIconName, FC<TIconProps>> = {
  menu: MenuIcon,
  back: BackIcon,
  life: PartOfLifeIcon,
  settings: ProfileIcon,
  friends: HouseIcon,
  [LIFE_MODES.MONTHS]: MonthsIcon,
  [LIFE_MODES.SEASONS]: SeasonsIcon,
  [LIFE_MODES.YEARS]: YearsIcon,
};
