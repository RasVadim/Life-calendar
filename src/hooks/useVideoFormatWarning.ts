import { useTranslation, useNotifications } from '@/hooks';

type TShowVideoFormatWarningParams = {
  onClose: () => void;
  format: string;
  codec: string;
};

export const useVideoFormatWarning = () => {
  const { t } = useTranslation();
  const { showNotification } = useNotifications();

  const showVideoFormatWarning = ({ onClose, format, codec }: TShowVideoFormatWarningParams) => {
    const message = t('videoFormatWarning.message', { format, codec });

    showNotification({
      message,
      buttonLabel: t('videoFormatWarning.close'),
      onButtonClick: onClose,
      autoHide: true,
    });
  };

  return { showVideoFormatWarning };
};
