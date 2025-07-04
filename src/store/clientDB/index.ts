export { LifeCalendarDB, lifeCalendarDB } from './lifeCalendarDB';

export type { IWeek } from './lifeCalendarDB';

// Mutations
export { saveDBWeeks } from './mutations/life/saveDBWeeks';
export { resetDBWeeks } from './mutations/life/resetDBWeeks';
export { updateDBWeek } from './mutations/life/updateDBWeek';
export { updateDBTodayWeek } from './mutations/life/updateDBTodayWeek';
export { updateDBUserData } from './mutations/life/updateDBUserData';

// Queries
export { useDBWeeks } from './queries/life/useDBWeeks';
export { useDBUserData } from './queries/life/useDBUserData';
export { useDBTodayWeek } from './queries/life/useDBTodayWeek';

// initializers
export { initDefaultWeeks } from './initializers/initDefaultWeeks';
