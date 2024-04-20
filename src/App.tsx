import { useEffect } from "react";
import i18n from "i18next";

import { Routes } from "@/Routes";
import { useLanguage, useSetSyncPending } from "@/store/atoms";

const App = () => {
  const [language] = useLanguage();
  const setPending = useSetSyncPending();

  useEffect(() => {
    // Setting language from local storage
    i18n.changeLanguage(language).then(() => {
      setPending(false);
    });
  }, [language]);

  return <Routes />;
};

export default App;
