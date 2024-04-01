import { useAtom } from "jotai";

import { ThemeMode } from "./atom";

export const useThemeMode = useAtom(ThemeMode);
