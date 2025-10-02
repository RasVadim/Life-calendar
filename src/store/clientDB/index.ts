export { LifeCalendarDB, lifeCalendarDB } from './lifeCalendarDB';

export type {
  IWeek,
  IDrawWeekIndexes,
  IHoliday,
  IUserData,
  ISettings,
  IMeta,
  IMedia,
  IFileBlob,
} from './interfaces';

// Mutations
export { saveDBWeeks } from './mutations/life/saveDBWeeks';
export { saveDBDrawWeekIndexes } from './mutations/life/saveDBDrawWeekIndexes';
export { resetDBWeeks } from './mutations/life/resetDBWeeks';
export { updateDBWeek } from './mutations/life/updateDBWeek';
export { updateDBTodayWeek } from './mutations/life/updateDBTodayWeek';
export { updateDBDay } from './mutations/life/updateDBDay';
export { updateDBUserData } from './mutations/life/updateDBUserData';
export { updateDBSettings } from './mutations/settings/updateDBSettings';

export { updateDBMedia } from './mutations/media/updateDBMedia';
export { safeUpdateDBMedia } from './mutations/media/safeUpdateDBMedia';
export { saveDBFileBlob } from './mutations/media/saveDBFileBlob';
export { addDBMediaItem } from './mutations/media/addDBMediaItem';

// Queries
export { useDBWeeks } from './queries/life/useDBWeeks';
export { useDBWeekById } from './queries/life/useDBWeekById';
export { useDBWeekByIndex } from './queries/life/useDBWeekByIndex';
export { useDBUserData } from './queries/life/useDBUserData';
export { useDBTodayWeek } from './queries/life/useDBTodayWeek';
export { useDBDrawWeekIndexes } from './queries/life/useDBDrawWeekIndexes';
export { useDBSettings } from './queries/settings/useDBSettings';

export { useDBMedia } from './queries/media/useDBMedia';
export { useDBFileBlob } from './queries/media/useDBFileBlob';

// initializers
export { initDefaultWeeks } from './initializers/initDefaultWeeks';
