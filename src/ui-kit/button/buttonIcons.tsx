import { ReactElement } from 'react';

import {
  BackIcon,
  EventsIcon,
  HouseIcon,
  MenuIcon,
  PartOfLifeIcon,
  ProfileIcon,
} from '@/icons';

export type TIconName = 'menu' | 'back' | 'life' | 'settings' | 'events' | 'plans';

export const BUTTON_ICONS: Record<TIconName, ReactElement> = {
  menu: <MenuIcon />,
  back: <BackIcon />,
  life: <PartOfLifeIcon />,
  settings: <ProfileIcon />,
  events: <EventsIcon />,
  plans: <HouseIcon />,
};
