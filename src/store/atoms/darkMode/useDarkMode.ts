import { useAtom } from "jotai";

import { DarkMode } from "./atom";

export const useDarkMode = () => useAtom(DarkMode);
