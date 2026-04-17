import { useEffect, type ReactNode, type MouseEvent } from 'react';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
  size?: 'small' | 'medium' | 'large';
  showFooter?: boolean;
  onConfirm?: () => void;
  confirmText?: string;
  cancelText?: string;
};

export function Modal(props: Props) {
  const {
    isOpen,
    onClose,
    title,
    children,
    size,
    showFooter = true,
    onConfirm,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
  } = props;

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sizeModifier =
    size === 'large'
      ? ' users__modal-dialog--lg'
      : size === 'small'
        ? ' users__modal-dialog--sm'
        : '';
  const modalSizeClass = `users__modal-dialog${sizeModifier}`;

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="users__modal-overlay" onClick={handleOverlayClick}>
      <div className={modalSizeClass}>
        <div className="users__modal-header">
          <h3 className="users__modal-title">{title ?? 'Modal'}</h3>
          <button
            type="button"
            className="users__modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="users__modal-body">{children}</div>
        {showFooter && (
          <div className="users__modal-footer">
            <button
              type="button"
              className="btn users__btn--secondary"
              onClick={onClose}
            >
              {cancelText}
            </button>
            {onConfirm && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={onConfirm}
              >
                {confirmText}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Modal;
