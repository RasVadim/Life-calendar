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
import { ELifeMode } from '@/types';

type TBaseIconName = 'menu' | 'back' | 'life' | 'settings' | 'friends';
export type TIconName = TBaseIconName | ELifeMode;

export type TIconProps = {
  isActive?: boolean;
};

export const BUTTON_ICONS: Record<TIconName, FC<TIconProps>> = {
  menu: MenuIcon,
  back: BackIcon,
  life: PartOfLifeIcon,
  settings: ProfileIcon,
  friends: HouseIcon,
  [ELifeMode.Months]: MonthsIcon,
  [ELifeMode.Seasons]: SeasonsIcon,
  [ELifeMode.Years]: YearsIcon,
};
