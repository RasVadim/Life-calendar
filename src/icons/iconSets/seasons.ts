import { FC } from 'react';

import { WinterIcon, SpringIcon, SummerIcon, AutumnIcon } from '@/icons';
import { ESeason } from '@/types';

export const SEASONS_ICONS: Record<ESeason, FC<{ size?: string; color?: string }>> = {
  [ESeason.Winter]: WinterIcon,
  [ESeason.Spring]: SpringIcon,
  [ESeason.Summer]: SummerIcon,
  [ESeason.Autumn]: AutumnIcon,
};
