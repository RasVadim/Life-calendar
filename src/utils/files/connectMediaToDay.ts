import { updateDBDay } from '@/store/clientDB';

type TConnectMediaToDayOptions = {
  weekIndex?: number;
  dayIndex?: number;
  dateKey: string;
};

export const connectMediaToDay = async ({
  weekIndex,
  dayIndex,
  dateKey,
}: TConnectMediaToDayOptions) => {
  if (!weekIndex || !dayIndex || !dateKey) {
    console.error('Week index, day index and date key are required');
    return;
  }

  updateDBDay({ weekIndex, dayIndex, dayUpdates: { media: dateKey } });
};
