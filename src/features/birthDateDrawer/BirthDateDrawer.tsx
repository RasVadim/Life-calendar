import { useMemo, useState, useEffect } from 'react';

import { addYears, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useNavigate, useLocation } from 'react-router-dom';

import { ISO_DATE_FORMAT, DEFAULT_BIRTH_DATE } from '@/constants';
import { useTranslation } from '@/hooks';
import { OutlineProfileIcon } from '@/icons';
import { useSetOpenDrawerKey, useSetPageLoading, useSetSyncPending } from '@/store/atoms';
import { resetDBWeeks, saveDBWeeks, updateDBUserData, updateDBTodayWeek } from '@/store/clientDB';
import { useDBUserData } from '@/store/clientDB';
import { EModalKeys } from '@/types';
import { Button, Drawer, WheelDatePicker } from '@/ui-kit';
import { generateWeeksInWorker } from '@/webWorkers';

import { InfoAfterBirthDate } from './components';
import { getLifeExpectancy } from './utils';

import s from './s.module.styl';

export const BirthDateDrawer = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const setDrawerKey = useSetOpenDrawerKey();
  const setPending = useSetSyncPending();
  const setPageLoading = useSetPageLoading();

  const [birthDate, setBirthDate] = useState<string | null>(null);

  const userData = useDBUserData();

  const lifeExpectancy = getLifeExpectancy(birthDate);

  // On mount, get birth date from DB if exists
  useEffect(() => {
    setBirthDate(userData?.birthDate || '');
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
          icon={<OutlineProfileIcon isActive />}
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
    console.log('calculateLifeExpectancy!!!', birthDate, lifeExpectancy);
    setDrawerKey(null);

    if (birthDate) {
      setPageLoading(true);
      setPending(true);
      try {
        if (location.pathname !== '/') {
          navigate('/');
        }

        const deathDate = format(addYears(new Date(birthDate), lifeExpectancy), ISO_DATE_FORMAT);

        await updateDBUserData({
          birthDate,
          lifeExpectancy,
          deathDate,
        });
        // --- Web Worker helper ---
        const { weeks, todayWeekId, todayWeekIndex } = await generateWeeksInWorker(
          birthDate,
          lifeExpectancy,
        );

        await resetDBWeeks();
        await saveDBWeeks(weeks);

        await updateDBTodayWeek({ todayWeekId, todayWeekIndex });
      } catch (err) {
        console.error('generate weeks not finished, error: ', err);
      } finally {
        setPending(false);
        setPageLoading(false);
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
        <div className={s.introText}>{t('life.birthDateDrawerIntro')}</div>
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
          lifeExpectancy={lifeExpectancy}
        />
      </div>
    </Drawer>
  );
};
