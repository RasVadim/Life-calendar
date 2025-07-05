import { FC } from 'react';

import { HorseCircleIcon, HorseIcon } from '@/icons';
import { updateDBSettings, useDBSettings } from '@/store/clientDB';
import { EZodiacMode } from '@/types';
import { Segmented } from '@/ui-kit';

import s from './s.module.styl';

export const YaerIconActions: FC = () => {
  const settings = useDBSettings();

  return (
    <div className={s.wrapper}>
      <Segmented
        tabs={[
          { label: '', value: EZodiacMode.NATURAL, icon: <HorseIcon /> },
          { label: '', value: EZodiacMode.CIRCLES, icon: <HorseCircleIcon /> },
          { label: 'Off', value: EZodiacMode.OFF },
        ]}
        onSelection={(value) => {
          updateDBSettings({
            zodiacMode: value as EZodiacMode,
          });
        }}
        defaultValue={settings?.zodiacMode}
        value={settings?.zodiacMode}
      />
    </div>
  );
};
