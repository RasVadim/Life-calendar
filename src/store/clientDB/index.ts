export { LifeCalendarDB, lifeCalendarDB } from './lifeCalendarDB';

export type { IWeek } from './lifeCalendarDB';

// Mutations
export { saveWeeks } from './mutations/life/saveWeeks';
export { resetDBWeeks } from './mutations/life/resetDBWeeks';
export { updateWeek } from './mutations/life/updateWeek';
export { updateTodayWeek } from './mutations/life/updateTodayWeek';
export { updateUserData } from './mutations/life/updateUserData';

// Queries
export { useDBWeeks } from './queries/life/useDBWeeks';
export { useDBUserData } from './queries/life/useDBUserData';
export { useTodayWeek } from './queries/life/useTodayWeek';

// initializers
export { initDefaultWeeks } from './initializers/initDefaultWeeks';
