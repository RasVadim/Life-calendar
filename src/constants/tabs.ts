import { PATHS } from '@/constants';
import { LIFE_MODES } from '@/constants';
import { TIconName } from '@/ui-kit';

type TTab = { icon: TIconName; label: string; to: string };

export const TABS: TTab[] = [
  {
    icon: 'plans',
    label: 'plans',
    to: PATHS.PLANS,
  },
  {
    icon: LIFE_MODES.YEARS,
    label: 'life',
    to: PATHS.MAIN,
  },
  {
    icon: 'settings',
    label: 'settings',
    to: PATHS.SETTINGS,
  },
];
