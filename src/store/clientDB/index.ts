export { LifeCalendarDB, lifeCalendarDB } from './lifeCalendarDB';

export type { IWeek, IDrawWeekIndexes, IHoliday } from './lifeCalendarDB';

// Mutations
export { saveDBWeeks } from './mutations/life/saveDBWeeks';
export { saveDrawWeekIndexes } from './mutations/life/saveDrawWeekIndexes';
export { resetDBWeeks } from './mutations/life/resetDBWeeks';
export { updateDBWeek } from './mutations/life/updateDBWeek';
export { updateDBTodayWeek } from './mutations/life/updateDBTodayWeek';
export { updateDBUserData } from './mutations/life/updateDBUserData';
export { updateDBSettings } from './mutations/settings/updateDBSettings';

// Queries
export { useDBWeeks } from './queries/life/useDBWeeks';
export { useDBUserData } from './queries/life/useDBUserData';
export { useDBTodayWeek } from './queries/life/useDBTodayWeek';
export { useDBDrawWeekIndexes } from './queries/life/useDBDrawWeekIndexes';

export { useDBSettings } from './queries/settings/useDBSettings';

// initializers
export { initDefaultWeeks } from './initializers/initDefaultWeeks';
