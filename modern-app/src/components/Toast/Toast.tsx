import { useEffect, useRef, useState } from 'react';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

export type ToastProps = {
  message: string;
  type?: ToastType;
  position?: ToastPosition;
  duration?: number;
  autoHide?: boolean;
  onClose?: () => void;
};

function getIcon(type: ToastType): string {
  switch (type) {
    case 'success':
      return '\u2713';
    case 'error':
      return '\u2717';
    case 'warning':
      return '\u26A0';
    case 'info':
    default:
      return '\u2139';
  }
}

export function Toast({
  message,
  type = 'info',
  position = 'top-right',
  duration = 3000,
  autoHide = true,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState<boolean>(true);
  const timerRef = useRef<number | null>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!autoHide) return;
    timerRef.current = window.setTimeout(() => {
      setVisible(false);
      window.setTimeout(() => {
        onCloseRef.current?.();
      }, 300);
    }, duration);
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, [message, autoHide, duration]);

  const handleClose = () => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    setVisible(false);
    window.setTimeout(() => {
      onCloseRef.current?.();
    }, 300);
  };

  if (!message) return null;

  const className =
    'toast-notification toast-' + type + ' toast-' + position + (visible ? ' toast-visible' : '');

  return (
    <div className={className} role="status">
      <span className="toast-icon">{getIcon(type)}</span>
      <span className="toast-message">{message}</span>
      <button type="button" className="toast-close" onClick={handleClose} aria-label="Close">
        &times;
      </button>
    </div>
  );
}

export default Toast;
