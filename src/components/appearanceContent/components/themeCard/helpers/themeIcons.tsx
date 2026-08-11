// TODO: unused icons
import { MoonIcon, PaletteIcon, RocketIcon, StarIcon, SunIcon } from '@/icons';
import { EThemeMode } from '@/types';

// Generate themes array dynamically from EThemeMode
export const themeIcons: Record<EThemeMode, JSX.Element> = {
  [EThemeMode.LIGHT]: <SunIcon />,
  [EThemeMode.DARK]: <MoonIcon />,
  [EThemeMode.EXPERIMENTAL]: <StarIcon />,
  [EThemeMode.CUSTOM]: <PaletteIcon />,
  [EThemeMode.FUTURE]: <RocketIcon />,
};
