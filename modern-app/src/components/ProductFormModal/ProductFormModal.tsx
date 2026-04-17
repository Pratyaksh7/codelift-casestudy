import { useState } from 'react';
import {
  EMPTY_PRODUCT_FORM,
  PRODUCT_CATEGORIES,
  type Product,
  type ProductFormData,
} from '../../hooks/useProducts';
import './ProductFormModal.css';

export type ProductFormModalProps = {
  editingProduct: Product | null;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => void;
};

function productToFormData(product: Product): ProductFormData {
  return {
    name: product.name,
    price: product.price.toString(),
    category: product.category,
    stock: product.stock.toString(),
    description: product.description,
  };
}

export function ProductFormModal({
  editingProduct,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  const [formData, setFormData] = useState<ProductFormData>(() =>
    editingProduct ? productToFormData(editingProduct) : EMPTY_PRODUCT_FORM,
  );

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div
      className="products-page__modal-overlay"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="products-page__modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="products-page__modal-header">
          <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
          <button
            type="button"
            className="products-page__modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="products-page__form-group">
            <label htmlFor="products-name">Product Name</label>
            <input
              id="products-name"
              type="text"
              name="name"
              className="products-page__form-input"
              value={formData.name}
              onChange={handleFormChange}
              required
            />
          </div>
          <div className="products-page__form-row">
            <div className="products-page__form-group">
              <label htmlFor="products-price">Price ($)</label>
              <input
                id="products-price"
                type="number"
                name="price"
                className="products-page__form-input"
                step="0.01"
                value={formData.price}
                onChange={handleFormChange}
                required
              />
            </div>
            <div className="products-page__form-group">
              <label htmlFor="products-stock">Stock</label>
              <input
                id="products-stock"
                type="number"
                name="stock"
                className="products-page__form-input"
                value={formData.stock}
                onChange={handleFormChange}
                required
              />
            </div>
          </div>
          <div className="products-page__form-group">
            <label htmlFor="products-category">Category</label>
            <select
              id="products-category"
              name="category"
              className="products-page__form-input"
              value={formData.category}
              onChange={handleFormChange}
              required
            >
              <option value="">Select category</option>
              {PRODUCT_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="products-page__form-group">
            <label htmlFor="products-description">Description</label>
            <textarea
              id="products-description"
              name="description"
              className="products-page__form-input"
              rows={3}
              value={formData.description}
              onChange={handleFormChange}
            />
          </div>
          <div className="products-page__form-actions">
            <button
              type="button"
              className="products-page__btn products-page__btn--cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="products-page__btn products-page__btn--primary"
            >
              {editingProduct ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductFormModal;
