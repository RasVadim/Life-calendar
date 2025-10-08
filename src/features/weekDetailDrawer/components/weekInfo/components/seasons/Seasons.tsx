import { FC } from 'react';

import cx from 'classnames';

import { useTranslation } from '@/hooks';
import { SEASONS_ICONS } from '@/icons';
import { ESeason } from '@/types';

import s from './s.module.styl';

type TSeasonsProps = {
  season?: ESeason;
  secondSeason?: ESeason | null;
  isEvenSeason: boolean;
};

export const Seasons: FC<TSeasonsProps> = ({ season, secondSeason, isEvenSeason }) => {
  const { t } = useTranslation();
  if (!season) return null;

  const seasonLabel = season ? t(`life.${season}`) : '';
  const secondSeasonLabel = secondSeason ? t(`life.${secondSeason}`) : '';

  const SeasonIcon = SEASONS_ICONS?.[season as ESeason];
  const SecondSeasonIcon = SEASONS_ICONS?.[secondSeason as ESeason];

  return (
    <div className={s.seasons}>
      <span className={cx(s.seasonItem, { [s.secondColor]: isEvenSeason })}>
        {SeasonIcon && <SeasonIcon size={'14'} />}
        {seasonLabel}
      </span>
      {secondSeasonLabel && (
        <span className={cx(s.seasonItem, { [s.secondColor]: !isEvenSeason })}>
          <span className={s.separator}>/</span>
          {secondSeasonLabel}
          {SecondSeasonIcon && <SecondSeasonIcon size={'14'} />}
        </span>
      )}
    </div>
  );
};
