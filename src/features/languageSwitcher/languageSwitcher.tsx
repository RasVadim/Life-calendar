import { useSetLanguage } from "@/store/atoms";

import s from "./s.module.styl";
export const LanguageSwitcher = () => {
  const setLang = useSetLanguage();

  return (
    <div className={s.wrapper}>
      <button onClick={() => setLang("en")} className={s.button}>
        English
      </button>
      <button onClick={() => setLang("ru")} className={s.button}>
        Русский
      </button>
    </div>
  );
};
