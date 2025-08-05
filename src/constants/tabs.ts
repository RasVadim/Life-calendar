import { PATHS } from '@/constants';
import { ELifeMode } from '@/types';
import { TIconName } from '@/ui-kit';

type TTab = { icon: TIconName; label: string; to: string };

export const TABS: TTab[] = [
  {
    icon: 'friends',
    label: 'friends',
    to: PATHS.FRIENDS,
  },
  {
    icon: ELifeMode.Years,
    label: 'life',
    to: PATHS.MAIN,
  },
  {
    icon: 'settings',
    label: 'settings',
    to: PATHS.SETTINGS,
  },
];
