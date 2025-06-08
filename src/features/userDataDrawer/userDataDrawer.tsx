import { useMemo, useState, useEffect } from 'react';

import { ru } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

import { DEFAULT_BIRTH_DATE, DEFAULT_LIFE_SPAN_YEARS } from '@/constants';
import { OutlineProfile } from '@/icons';
import { useSetOpenDrawerKey, useSetSyncPending } from '@/store/atoms';
import { saveWeeks, updateUserData } from '@/store/clientDB';
import { useDBUserData } from '@/store/clientDB';
import { EModalKeys } from '@/types';
import { Button, Drawer, WheelDatePicker } from '@/ui-kit';
import { generateWeeksInWorker } from '@/webWorkers';

import { InfoAfterBirthDate } from './components';

import s from './s.module.styl';

export const UserDataDrawer = () => {
  const { t, i18n } = useTranslation();

  const setDrawerKey = useSetOpenDrawerKey();
  const setPending = useSetSyncPending();

  const [birthDate, setBirthDate] = useState<string | null>(null);

  const userData = useDBUserData();

  // On mount, get birth date from DB if exists
  useEffect(() => {
    const fetchBirthDate = async () => {
      setBirthDate(userData?.birthDate || '');
    };
    fetchBirthDate();
  }, [userData?.birthDate]);

  // Save birth date to IndexedDB on change
  const handleBirthDateChange = async (newDate: string) => {
    setBirthDate(newDate);
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
    [t],
  );

  const handleClose = () => {
    if (!userData?.birthDate) {
      calculateLifeExpectancy();
      return;
    }

    setBirthDate(userData?.birthDate);
    setDrawerKey(null);
  };

  const calculateLifeExpectancy = async () => {
    setDrawerKey(null);

    if (birthDate) {
      setPending(true);
      try {
        await updateUserData({ birthDate, lifeExpectancy: DEFAULT_LIFE_SPAN_YEARS });
        // --- Web Worker через хелпер ---
        const weeks = await generateWeeksInWorker(birthDate, DEFAULT_LIFE_SPAN_YEARS);
        await saveWeeks(weeks);
      } catch (err) {
        // handle error
      } finally {
        setPending(false);
      }
    }
  };

  return (
    <Drawer
      title={t('life.lifeInWeeks')}
      keyProp={EModalKeys.USER_BIRTH_DATE}
      onClose={handleClose}
      actions={actions}
      disabledClose={!birthDate}
    >
      <div className={s.introWrap}>
        <div className={s.introText}>{t('life.userDataDrawerIntro')}</div>
        {birthDate !== null && (
          <WheelDatePicker
            value={birthDate}
            onChange={handleBirthDateChange}
            locale={i18n.language === 'ru' ? ru : undefined}
            defaultDate={userData?.birthDate || DEFAULT_BIRTH_DATE}
            debounced={!userData?.birthDate}
          />
        )}
        <InfoAfterBirthDate
          birthDate={birthDate || ''}
          birthDateFromDB={userData?.birthDate || ''}
          onButtonClick={calculateLifeExpectancy}
        />
      </div>
    </Drawer>
  );
};
