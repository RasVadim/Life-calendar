import { atomWithStorage } from "jotai/utils";

export type TLanguage = "en" | "ru";

export const Language = atomWithStorage<TLanguage>("language", "en");
