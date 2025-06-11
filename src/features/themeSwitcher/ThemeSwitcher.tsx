import { useTranslation } from 'react-i18next';

import { EThemeMode, useThemeMode } from '@/store/atoms';
import { Button } from '@/ui-kit';

import s from './s.module.styl';

export const ThemeSwitcher = () => {
  const { t } = useTranslation();
  const [theme, setTheme] = useThemeMode();

  return (
    <div className={s.wrapper}>
      {Object.values(EThemeMode).map((mode) => (
        <Button
          key={mode}
          onClick={() => setTheme(mode)}
          size="small"
          label={t(`layout.${mode}`)}
          selected={theme === mode}
        />
      ))}
    </div>
  );
};
