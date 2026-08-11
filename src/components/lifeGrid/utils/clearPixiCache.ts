import { clearLabelCache } from '../renders/renderLabel';
import { clearWeekCache } from '../renders/renderWeek';
import { clearTextureCache } from '../renders/utils/threadTextures';

export const clearPixiCache = () => {
  clearTextureCache();
  clearWeekCache();
  clearLabelCache();
};
