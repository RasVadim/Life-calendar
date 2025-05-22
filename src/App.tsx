import { useEffect } from "react";

import i18n from "i18next";

import { Routes } from "@/Routes";
import {
  useLanguage,
  useThemeMode,
  useSetSyncPending,
} from "@/store/atoms";

import { toggleTheme } from "./utils";
// Function to enter fullscreen
function enterFullscreen() {
  document.documentElement.requestFullscreen();
}

// Event listener for visibilitychange
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    enterFullscreen();
  }
});
const App = () => {
  const [language] = useLanguage();
  const [theme] = useThemeMode();
  const setPending = useSetSyncPending();

  useEffect(() => {
    toggleTheme(theme);
  }, [theme]);

  useEffect(() => {
    // Setting language from local storage
    i18n.changeLanguage(language).then(() => {
      setPending(false);
    });
  }, [language]);

  return <Routes />;
};

export default App;
