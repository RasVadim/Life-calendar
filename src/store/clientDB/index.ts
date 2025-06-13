export { LifeCalendarDB, lifeCalendarDB } from './lifeCalendarDB';

export type { IWeek } from './lifeCalendarDB';

// Mutations
export { saveWeeks } from './mutations/life/saveWeeks';
export { resetDBWeeks } from './mutations/life/resetDBWeeks';
export { updateUserData } from './mutations/life/updateUserData';

// Queries
export { useDBWeeks } from './queries/life/useDBWeeks';
export { useDBUserData } from './queries/life/useDBUserData';

// initializers
export { initDefaultWeeks } from './initializers/initDefaultWeeks';
