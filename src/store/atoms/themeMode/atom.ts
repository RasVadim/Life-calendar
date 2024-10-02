import { atomWithStorage } from "jotai/utils";

export enum EThemeMode {
  LIGHT = "light",
  DARK = "dark",
}

export const ThemeMode = atomWithStorage<EThemeMode>(
  "darkMode",
  EThemeMode.LIGHT
);
