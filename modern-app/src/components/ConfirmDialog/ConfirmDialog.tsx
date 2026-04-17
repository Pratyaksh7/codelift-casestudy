import type { ReactNode } from 'react';

export type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;
  return (
    <div className="inventory-page__modal-overlay" onClick={onCancel}>
      <div
        className="inventory-page__confirm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="inventory-page__confirm-header inventory-page__confirm-header--warning">
          <h3>{title}</h3>
        </div>
        <div className="inventory-page__confirm-body">{message}</div>
        <div className="inventory-page__confirm-footer">
          <button
            className="inventory-page__btn inventory-page__btn--secondary"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            className="inventory-page__btn inventory-page__btn--warn"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
