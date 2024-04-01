import { atomWithStorage } from "jotai/utils";

type TThemeMode = "light" | "dark";

export const ThemeMode = atomWithStorage<TThemeMode>("themeMode", "light");
