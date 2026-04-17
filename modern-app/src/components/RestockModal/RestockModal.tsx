import { useState } from 'react';

export type RestockModalProps = {
  onClose: () => void;
  onConfirm: (quantity: number) => void;
};

export function RestockModal({ onClose, onConfirm }: RestockModalProps) {
  const [quantity, setQuantity] = useState('');

  const handleConfirm = () => {
    const qty = parseInt(quantity, 10);
    if (Number.isNaN(qty) || qty <= 0) {
      alert('Please enter a valid quantity');
      return;
    }
    onConfirm(qty);
  };

  return (
    <div className="inventory-page__modal-overlay" onClick={onClose}>
      <div
        className="inventory-page__modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="inventory-page__modal-header">
          <h3>Restock Item</h3>
          <button
            className="inventory-page__modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <div className="inventory-page__modal-body">
          <div className="inventory-page__form-group">
            <label htmlFor="restock-qty">Quantity to Add</label>
            <input
              id="restock-qty"
              type="number"
              className="inventory-page__form-input"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="Enter quantity"
            />
          </div>
        </div>
        <div className="inventory-page__modal-footer">
          <button
            className="inventory-page__btn inventory-page__btn--secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="inventory-page__btn inventory-page__btn--primary"
            onClick={handleConfirm}
          >
            Restock
          </button>
        </div>
      </div>
    </div>
  );
}

export default RestockModal;
