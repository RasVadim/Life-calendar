import { TIconName } from '@/ui-kit';
import { PATHS } from '@/constants';

type TTab = { icon: TIconName; label: string; to: string };

export const TABS: TTab[] = [
  {
    icon: 'plans',
    label: 'plans',
    to: PATHS.PLANS,
  },
  {
    icon: 'life',
    label: 'life',
    to: PATHS.MAIN,
  },
  {
    icon: 'settings',
    label: 'settings',
    to: PATHS.EVENTS,
  },
];
