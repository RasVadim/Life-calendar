import { FC } from 'react';

import {
  AboutIcon,
  ProfileSettingsIcon,
  DataStorageIcon,
  AppearanceIcon,
  LanguageIcon,
  PremiumIcon,
} from '@/icons';
import { ESettings } from '@/types';

export const SETTINGS_ICONS: Record<ESettings, FC<{ size?: string; color?: string }>> = {
  [ESettings.PROFILE]: ProfileSettingsIcon,
  [ESettings.STORAGE]: DataStorageIcon,
  [ESettings.APPEARANCE]: AppearanceIcon,
  [ESettings.LANGUAGE]: LanguageIcon,
  [ESettings.PREMIUM]: PremiumIcon,
  [ESettings.ABOUT]: AboutIcon,
};
