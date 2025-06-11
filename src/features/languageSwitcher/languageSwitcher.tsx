import { useSetLanguage } from '@/store/atoms';
import { Button } from '@/ui-kit';

import s from './s.module.styl';
export const LanguageSwitcher = () => {
  const setLang = useSetLanguage();

  return (
    <div className={s.wrapper}>
      <Button onClick={() => setLang('en')} label="English" />
      <Button onClick={() => setLang('ru')} label="Русский" />
    </div>
  );
};
