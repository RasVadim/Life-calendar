import { FC } from 'react';

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
import { LIFE_MODES } from '@/constants';

type TBaseIconName = 'menu' | 'back' | 'life' | 'settings' | 'plans';
export type TIconName =
  | TBaseIconName
  | (typeof LIFE_MODES)[keyof typeof LIFE_MODES];

export type TIconProps = {
  isActive?: boolean;
};

export const BUTTON_ICONS: Record<TIconName, FC<TIconProps>> = {
  menu: MenuIcon,
  back: BackIcon,
  life: PartOfLifeIcon,
  settings: ProfileIcon,
  plans: HouseIcon,
  [LIFE_MODES.MONTHS]: MonthsIcon,
  [LIFE_MODES.SEASONS]: SeasonsIcon,
  [LIFE_MODES.YEARS]: YearsIcon,
};
