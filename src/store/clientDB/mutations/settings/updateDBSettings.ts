import { lifeCalendarDB } from '@/store/clientDB';
import type { ISettings } from '@/store/clientDB/interfaces';
import { EThemeMode, EZodiacMode } from '@/types/settings';

/**
 * Update settings in IndexedDB. Only provided fields will be updated.
 * @param newSettings - Partial settings fields to update
 */
export const updateDBSettings = async (newSettings: Partial<ISettings>) => {
  let prev = await lifeCalendarDB.settings.get('main');
  if (!prev) {
    // Create new settings if not exists
    prev = {
      id: 'main',
      theme: EThemeMode.DARK,
      language: 'en',
      zodiacMode: EZodiacMode.NATURAL,
    };
  }
  await lifeCalendarDB.settings.put({
    ...prev,
    ...newSettings,
    id: 'main',
  });
};
