import { useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { DEFAULT_BIRTH_DATE } from '@/constants';
import { DRAWER_KEYS } from '@/constants/modal';
import { OutlineProfile } from '@/icons/OutlineProfile';
import { useSetOpenDrawerKey } from '@/store/atoms';
import { Button, Drawer, DataPicker } from '@/ui-kit';

import { InfoAfterBirthDate } from './components';

import s from './s.module.styl';

export const UserDataDrawer = () => {
  const { t } = useTranslation();
  const setDrawerKey = useSetOpenDrawerKey();
  const [birthDate, setBirthDate] = useState(DEFAULT_BIRTH_DATE);

  const actions = useMemo(
    () => (
      <div>
        <Button
          label={t('layout.login')}
          icon={<OutlineProfile isActive />}
          onClick={() => console.log('login')}
        />
      </div>
    ),
    [t]
  );

  return (
    <Drawer
      title={t('life.lifeInWeeks')}
      keyProp={DRAWER_KEYS.userData}
      onClose={() => setDrawerKey(null)}
      actions={actions}
      disabledClose={birthDate === DEFAULT_BIRTH_DATE}
    >
      <div className={s.introWrap}>
        <div className={s.introText}>{t('life.userDataDrawerIntro')}</div>
        <DataPicker
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          isDefault={birthDate === DEFAULT_BIRTH_DATE}
        />
        <InfoAfterBirthDate birthDate={birthDate} />
      </div>
    </Drawer>
  );
};
