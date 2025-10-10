import { useCallback } from 'react';

import { useNotification } from '@/store/atoms';
import { TNotification } from '@/types';

export const useNotifications = () => {
  const [notification, setNotification] = useNotification();
  const showNotification = useCallback(
    (notificationData: Omit<TNotification, 'id'>) => {
      const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      setNotification({ ...notificationData, id });
    },
    [setNotification],
  );

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, [setNotification]);

  return {
    notification,
    showNotification,
    hideNotification,
  };
};
