import { atomWithStorage } from "jotai/utils";

export const DarkMode = atomWithStorage<boolean>("darkMode", false);
