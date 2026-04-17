import type { CSSProperties } from 'react';

type DialogType = 'danger' | 'warning' | 'info';

type Props = {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  type?: DialogType;
};

const ICON_MAP: Record<DialogType, string> = {
  danger: '\u26A0',
  warning: '\u26A0',
  info: '\u2139',
};

export function ConfirmDialog(props: Props) {
  const {
    isOpen,
    onConfirm,
    onCancel,
    title = 'Confirm Action',
    message = 'Are you sure you want to proceed?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    type,
  } = props;

  if (!isOpen) return null;

  const confirmBtnClass = `btn ${type === 'danger' ? 'btn-danger' : 'btn-primary'}`;
  const icon = type ? ICON_MAP[type] : '\u2753';

  const iconStyle: CSSProperties = {
    backgroundColor: type === 'danger' ? '#fde8e8' : '#ebf5fb',
    color: type === 'danger' ? '#e74c3c' : '#4a90d9',
  };

  return (
    <div className="users__confirm-overlay">
      <div className="users__confirm-box">
        <div className="users__confirm-icon" style={iconStyle}>
          {icon}
        </div>
        <h3 className="users__confirm-title">{title}</h3>
        <p className="users__confirm-message">{message}</p>
        <div className="users__confirm-actions">
          <button
            type="button"
            className="btn users__btn--secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button type="button" className={confirmBtnClass} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
