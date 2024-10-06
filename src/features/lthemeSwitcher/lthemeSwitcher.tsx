import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useSetThemeMode, EThemeMode } from "@/store/atoms";

import s from "./s.module.styl";
export const ThemeSwitcher = ({testProp}) => {
  const { t } = useTranslation();
  const setTheme = useSetThemeMode();

useEffect(() => {
console.log('mount') //

return () => {
  console.log('unmount') //
}
}, [])

  return (
    <div className={s.wrapper}>
      <button onClick={() => setTheme(EThemeMode.LIGHT)} className={s.button}>
        {t("layout.light")}
      </button>
      <button onClick={() => setTheme(EThemeMode.DARK)} className={s.button}>
        {t("layout.dark")}
      </button>
    </div>
  );
};
