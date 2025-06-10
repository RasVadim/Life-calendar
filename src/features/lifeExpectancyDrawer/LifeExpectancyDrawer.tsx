import { useState, useEffect } from 'react';

import cx from 'classnames';
import { ru } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

import { useSetOpenDrawerKey, useSetSyncPending } from '@/store/atoms';
import { saveWeeks, updateUserData } from '@/store/clientDB';
import { useDBUserData } from '@/store/clientDB';
import { EModalKeys } from '@/types';
import { Drawer, WheelDatePicker, Select, Button } from '@/ui-kit';
import { generateWeeksInWorker } from '@/webWorkers';

import { InfoAfterChangeDeathDate } from './components';
import { LIFE_EXPECTANCY_OPTIONS } from './constants';

import s from './s.module.styl';

export const LifeExpectancyDrawer = () => {
  const { t, i18n } = useTranslation();

  const setDrawerKey = useSetOpenDrawerKey();
  const setPending = useSetSyncPending();

  const [showDeathDateBlock, setShowDeathDateBlock] = useState<boolean>(false);
  const [lifeExpectancy, setLifeExpectancy] = useState<number | null>(null);
  const [deathDate, setDeathDate] = useState<string | null>(null);

  const userData = useDBUserData();

  // On mount, get death date from DB if exists
  useEffect(() => {
    setDeathDate(userData?.deathDate || '');
  }, [userData?.deathDate]);

  // On mount, get life expectancy from DB if exists
  useEffect(() => {
    setLifeExpectancy(userData?.lifeExpectancy || null);
  }, [userData?.lifeExpectancy]);

  // Save birth date to IndexedDB on change
  const handleDeathDateChange = async (newDate: string) => {
    setDeathDate(newDate);
  };

  const handleClose = () => {
    setDeathDate(userData?.deathDate || '');
    setDrawerKey(null);
    setShowDeathDateBlock(false);
  };

  const calculateLifeExpectancy = async () => {
    setDrawerKey(null);

    if (lifeExpectancy) {
      setPending(true);
      try {
        await updateUserData({ deathDate, lifeExpectancy });
        // --- Web Worker helper ---
        const weeks = await generateWeeksInWorker(userData?.birthDate || '', lifeExpectancy);
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
      keyProp={EModalKeys.USER_LIFE_EXPECTANCY}
      onClose={handleClose}
    >
      <div className={s.introWrap}>
        <div className={s.introText}>{t('life.lifeExpectancyDrawerIntro')}</div>
        <Select
          options={LIFE_EXPECTANCY_OPTIONS.map((option) => ({
            value: option.value,
            label: `${option.labelValue} ${t(option.labelKey)}`,
          }))}
          value={String(lifeExpectancy || '')}
          onChange={(value) => setLifeExpectancy(Number(value))}
          placeholder={t('layout.selectLifeExpectancy')}
        />
        <div className={cx(s.exactDeathDateBlock, { [s.nonOpacity]: showDeathDateBlock })}>
          <Button
            link
            label={t('life.setExactDeathDate')}
            onClick={() => setShowDeathDateBlock((prev) => !prev)}
          />
        </div>
        {showDeathDateBlock && (
          <WheelDatePicker
            value={deathDate || ''}
            onChange={handleDeathDateChange}
            locale={i18n.language === 'ru' ? ru : undefined}
            defaultDate={userData?.deathDate || undefined}
            debounced={!userData?.deathDate}
            appearAnimation
          />
        )}
        <InfoAfterChangeDeathDate
          birthDate={userData?.birthDate || ''}
          deathDate={deathDate || ''}
          lifeExpectancy={lifeExpectancy || 0}
          onButtonClick={calculateLifeExpectancy}
          isDeathDateChanged={
            deathDate !== userData?.deathDate || lifeExpectancy !== userData?.lifeExpectancy
          }
        />
      </div>
    </Drawer>
  );
};
