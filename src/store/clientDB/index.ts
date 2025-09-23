export { LifeCalendarDB, lifeCalendarDB } from './lifeCalendarDB';

export type {
  IWeek,
  IDrawWeekIndexes,
  IHoliday,
  IUserData,
  ISettings,
  IMeta,
  IMedia,
} from './interfaces';

// Mutations
export { saveDBWeeks } from './mutations/life/saveDBWeeks';
export { saveDBDrawWeekIndexes } from './mutations/life/saveDBDrawWeekIndexes';
export { resetDBWeeks } from './mutations/life/resetDBWeeks';
export { updateDBWeek } from './mutations/life/updateDBWeek';
export { updateDBMedia } from './mutations/life/updateDBMedia';
export { safeUpdateDBMedia } from './mutations/life/safeUpdateDBMedia';
export { updateDBTodayWeek } from './mutations/life/updateDBTodayWeek';
export { updateDBUserData } from './mutations/life/updateDBUserData';
export { updateDBSettings } from './mutations/settings/updateDBSettings';

// Queries
export { useDBWeeks } from './queries/life/useDBWeeks';
export { useDBUserData } from './queries/life/useDBUserData';
export { useDBTodayWeek } from './queries/life/useDBTodayWeek';
export { useDBDrawWeekIndexes } from './queries/life/useDBDrawWeekIndexes';
export { useDBMedia } from './queries/life/useDBMedia';
export { useDBSettings } from './queries/settings/useDBSettings';

// initializers
export { initDefaultWeeks } from './initializers/initDefaultWeeks';
