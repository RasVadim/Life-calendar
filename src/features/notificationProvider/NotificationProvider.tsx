import { FC } from 'react';

import { useNotifications } from '@/hooks';
import { Notification } from '@/ui-kit';

export const NotificationProvider: FC = () => {
  const { notification, hideNotification } = useNotifications();

  if (!notification) {
    return null;
  }

  return (
    <Notification
      {...notification}
      className={notification.className}
      onClose={notification.onClose || hideNotification}
    >
      {notification.children}
    </Notification>
  );
};
