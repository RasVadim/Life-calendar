import { useMemo, useState, useEffect } from 'react';

import { ru } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

import { DEFAULT_BIRTH_DATE, DEFAULT_LIFE_SPAN_YEARS } from '@/constants';
import { DRAWER_KEYS } from '@/constants/modal';
import { OutlineProfile } from '@/icons';
import { useOpenDrawerKey, useSetSyncPending } from '@/store/atoms';
import {
  setBirthDate as setBirthDateToDB,
  saveWeeks,
  getBirthDate,
} from '@/store/clientDB';
import { Button, Drawer, WheelDatePicker } from '@/ui-kit';
import { generateWeeksInWorker } from '@/webWorkers';

import { InfoAfterBirthDate } from './components';

import s from './s.module.styl';

export const UserDataDrawer = () => {
  const { t, i18n } = useTranslation();

  const [drawerKey, setDrawerKey] = useOpenDrawerKey();
  const setPending = useSetSyncPending();

  const [birthDate, setBirthDate] = useState<string | null>(null);
  const [birthDateFromDB, setBirthDateFromDB] = useState<string | null>(null);

  // On mount, get birth date from DB if exists
  useEffect(() => {
    const fetchBirthDate = async () => {
      const dbBirthDate = await getBirthDate();
      setBirthDate(dbBirthDate || '');
      setBirthDateFromDB(dbBirthDate);
    };
    fetchBirthDate();
  }, []);

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
    if (!birthDateFromDB) {
      calculateLifeExpectancy();
      return;
    }

    setBirthDate(birthDateFromDB);
    setDrawerKey(null);
  };

  const calculateLifeExpectancy = async () => {
    setDrawerKey(null);

    if (birthDate) {
      setPending(true);
      try {
        await setBirthDateToDB(birthDate);
        setBirthDateFromDB(birthDate);
        // --- Web Worker через хелпер ---
        const weeks = await generateWeeksInWorker(
          birthDate,
          DEFAULT_LIFE_SPAN_YEARS,
        );
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
      keyProp={DRAWER_KEYS.userData}
      onClose={handleClose}
      actions={actions}
      disabledClose={!birthDate}
    >
      <div className={s.introWrap}>
        <div className={s.introText}>{t('life.userDataDrawerIntro')}</div>
        {birthDate !== null && drawerKey === DRAWER_KEYS.userData && (
          <WheelDatePicker
            value={birthDate}
            onChange={handleBirthDateChange}
            locale={i18n.language === 'ru' ? ru : undefined}
            defaultDate={birthDateFromDB || DEFAULT_BIRTH_DATE}
            debounced={!birthDateFromDB}
          />
        )}
        <InfoAfterBirthDate
          birthDate={birthDate || ''}
          birthDateFromDB={birthDateFromDB || ''}
          onButtonClick={calculateLifeExpectancy}
        />
      </div>
    </Drawer>
  );
};
