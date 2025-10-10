export type TNotification = {
  id: string;
  message: string;
  buttonLabel?: string;
  onButtonClick?: () => void;
  children?: React.ReactNode;
  className?: string;
  autoHide?: boolean;
  closable?: boolean;
  onClose?: () => void;
};
