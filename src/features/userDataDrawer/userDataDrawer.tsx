import { useMemo, useState, useEffect } from 'react';

import { useTranslation } from 'react-i18next';

import { DEFAULT_BIRTH_DATE } from '@/constants';
import { DRAWER_KEYS } from '@/constants/modal';
import { OutlineProfile } from '@/icons/OutlineProfile';
import { useSetOpenDrawerKey } from '@/store/atoms';
import { setBirthDate } from '@/store/clientDB';
import { getBirthDate } from '@/store/clientDB/queries/getBirthDate';
import { Button, Drawer, DatePicker } from '@/ui-kit';

import { InfoAfterBirthDate } from './components';

import s from './s.module.styl';

export const UserDataDrawer = () => {
  const { t } = useTranslation();
  const setDrawerKey = useSetOpenDrawerKey();
  const [birthDate, setBirthDateState] = useState<string>('');
  const [isBirthDateFromDB, setIsBirthDateFromDB] = useState(false);

  // On mount, get birth date from DB if exists
  useEffect(() => {
    const fetchBirthDate = async () => {
      const dbBirthDate = await getBirthDate();
      setBirthDateState(dbBirthDate || '');
      setIsBirthDateFromDB(!!dbBirthDate);
    };
    fetchBirthDate();
  }, []);

  // Save birth date to IndexedDB on change
  const handleBirthDateChange = async (newDate: string) => {
    setBirthDateState(newDate);
    setIsBirthDateFromDB(false); // сбрасываем, если пользователь меняет дату
    try {
      await setBirthDate(newDate);
    } catch (err) {
      // Handle error if needed
    }
  };

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
      disabledClose={!birthDate}
    >
      <div className={s.introWrap}>
        <div className={s.introText}>{t('life.userDataDrawerIntro')}</div>
        <DatePicker
          value={birthDate}
          defaultValue={DEFAULT_BIRTH_DATE}
          onChange={handleBirthDateChange}
          isDefault={!birthDate}
          confirmButtonLabel={t('layout.confirmDate')}
          confirmButtonVisible={!birthDate}
        />
        <InfoAfterBirthDate birthDate={birthDate} isFromDB={isBirthDateFromDB} />
      </div>
    </Drawer>
  );
};
