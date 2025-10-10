import { FC } from 'react';

import { useNotifications } from '@/hooks';
import { Notification } from '@/ui-kit';

export const NotificationProvider: FC = () => {
  const { notification } = useNotifications();

  if (!notification) {
    return null;
  }

  return (
    <Notification
      message={notification.message}
      buttonLabel={notification.buttonLabel}
      onButtonClick={notification.onButtonClick}
      className={notification.className}
      autoHide={notification.autoHide}
    >
      {notification.children}
    </Notification>
  );
};
