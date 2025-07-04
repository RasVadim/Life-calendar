import { useState, useEffect } from 'react';

import cx from 'classnames';
import { addYears, format, parseISO, differenceInHours } from 'date-fns';
import { ru } from 'date-fns/locale';
import { useLocation, useNavigate } from 'react-router-dom';

import { ISO_DATE_FORMAT } from '@/constants';
import { useTranslation } from '@/hooks';
import { useSetOpenDrawerKey, useSetPageLoading, useSetSyncPending } from '@/store/atoms';
import { resetDBWeeks, saveDBWeeks, updateDBUserData } from '@/store/clientDB';
import { useDBUserData } from '@/store/clientDB';
import { WheelDatePicker, Select, Button } from '@/ui-kit';
import { generateWeeksInWorker } from '@/webWorkers';

import { InfoAfterChangeDeathDate } from '../../components';
import { LIFE_EXPECTANCY_OPTIONS } from '../../constants';

import s from './s.module.styl';

export const LifeExpectancyDrawerContent = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const setDrawerKey = useSetOpenDrawerKey();
  const setPending = useSetSyncPending();
  const setPageLoading = useSetPageLoading();

  const [lifeExpectancy, setLifeExpectancy] = useState<number | null>(null);
  const [deathDate, setDeathDate] = useState<string | null>(null);
  const [showDeathDateBlock, setShowDeathDateBlock] = useState<boolean>(false);

  const isLifeExpectancyRounded = Number.isInteger(lifeExpectancy);
  const isLifeExpectancyDecadeRounded = lifeExpectancy
    ? Number.isInteger(lifeExpectancy / 10)
    : true;

  const userData = useDBUserData();

  // On mount, get death date from DB if exists
  useEffect(() => {
    setDeathDate(userData?.deathDate || '');
  }, [userData?.deathDate]);

  // On mount, get life expectancy from DB if exists
  useEffect(() => {
    setLifeExpectancy(userData?.lifeExpectancy || null);
  }, [userData?.lifeExpectancy]);

  useEffect(() => {
    setShowDeathDateBlock(isLifeExpectancyDecadeRounded === false);
  }, [isLifeExpectancyDecadeRounded]);

  // Save birth date to IndexedDB on change
  const handleDeathDateChange = async (newDate: string) => {
    setDeathDate(newDate);
    if (userData?.birthDate) {
      const birth = parseISO(userData.birthDate);
      const death = parseISO(newDate);
      const hInYear = 365.25 * 24;
      const years = differenceInHours(death, birth) / hInYear;
      setLifeExpectancy(Number(years.toFixed(2)));
    } else {
      setLifeExpectancy(null);
    }
  };

  const handleLifeExpectancyChange = async (newDate: string) => {
    setLifeExpectancy(Number(newDate));
    if (userData?.birthDate) {
      const death = addYears(new Date(userData.birthDate), Number(newDate));
      setDeathDate(format(death, ISO_DATE_FORMAT));
    } else {
      setDeathDate(null);
    }
  };

  const handleLifeExpectancyFocus = () => {
    setShowDeathDateBlock(false);
  };

  const calculateLifeExpectancy = async () => {
    setDrawerKey(null);

    if (location.pathname !== '/') {
      navigate('/');
    }

    if (lifeExpectancy) {
      setPending(true);
      setPageLoading(true);

      try {
        await updateDBUserData({ deathDate, lifeExpectancy });
        // --- Web Worker helper ---
        const weeks = await generateWeeksInWorker(
          userData?.birthDate || '',
          lifeExpectancy,
          deathDate || undefined,
        );
        await resetDBWeeks();
        await saveDBWeeks(weeks);
      } catch (err) {
        // handle error
      } finally {
        setPending(false);
        setPageLoading(false);
      }
    }
  };

  return (
    <>
      <div className={s.introWrap}>
        <div className={s.introText}>{t('life.lifeExpectancyDrawerIntro')}</div>
        <Select
          options={LIFE_EXPECTANCY_OPTIONS.map((option) => ({
            value: option.value,
            label: `${option.labelValue} ${t(option.labelKey)}`,
          }))}
          value={String(lifeExpectancy || '')}
          onChange={handleLifeExpectancyChange}
          placeholder={t('layout.selectLifeExpectancy')}
          disabled={!!showDeathDateBlock}
          isDisabledStyle={!isLifeExpectancyDecadeRounded}
          onFocus={handleLifeExpectancyFocus}
        />
        <div className={cx(s.exactDeathDateBlock, { [s.nonOpacity]: showDeathDateBlock })}>
          <Button
            link
            label={t('life.setExactDeathDate')}
            onClick={() => setShowDeathDateBlock((prev) => !prev)}
          />
        </div>
        {showDeathDateBlock && deathDate ? (
          <WheelDatePicker
            value={deathDate || ''}
            onChange={handleDeathDateChange}
            locale={i18n.language === 'ru' ? ru : undefined}
            defaultDate={userData?.deathDate || undefined}
            direction="future"
            debounced={!userData?.deathDate}
            appearAnimation
          />
        ) : (
          <div style={{ height: '180px' }} />
        )}
        <InfoAfterChangeDeathDate
          birthDate={userData?.birthDate || ''}
          deathDate={deathDate || ''}
          lifeExpectancy={lifeExpectancy || 0}
          onButtonClick={calculateLifeExpectancy}
          isDeathDateChanged={
            deathDate !== userData?.deathDate || lifeExpectancy !== userData?.lifeExpectancy
          }
          isLifeExpectancyRounded={isLifeExpectancyRounded}
        />
      </div>
    </>
  );
};
