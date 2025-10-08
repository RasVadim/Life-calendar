// import { useTranslation } from '@/hooks';
import { FC } from 'react';

import { useParams } from 'react-router-dom';

import { useSetOpenDrawerKey } from '@/store/atoms';
import { useDBWeekByIndex } from '@/store/clientDB';
import { EModalKeys, TMedia, TMediaDatesMap } from '@/types';
import { Drawer } from '@/ui-kit';

import { MediaBlock, WeekInfo } from './components';

type TProps = {
  mediaData?: TMediaDatesMap<TMedia>;
};

export const WeekDetailDrawer: FC<TProps> = ({ mediaData }) => {
  // const { t } = useTranslation();
  const { weekIndex } = useParams();
  const weekIndexNumber = weekIndex ? Number(weekIndex) : 0;
  const week = useDBWeekByIndex(weekIndexNumber);

  const setDrawerKey = useSetOpenDrawerKey();

  const handleClose = () => {
    setDrawerKey(null);
  };

  return (
    <Drawer
      title={''}
      keyProp={EModalKeys.WEEK_DETAIL}
      onClose={handleClose}
      closeButton={false}
      topContent={<MediaBlock week={week} mediaData={mediaData} />}
    >
      <WeekInfo week={week} />
    </Drawer>
  );
};
