import { useCallback, useState } from 'react';
import { ProductFormModal } from '../../components/ProductFormModal/ProductFormModal';
import { ProductTable } from '../../components/ProductTable/ProductTable';
import { ProductToolbar } from '../../components/ProductToolbar/ProductToolbar';
import {
  useProducts,
  type Product,
  type ProductFormData,
} from '../../hooks/useProducts';
import './Products.css';

function Products() {
  const {
    filteredProducts,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    deleteProduct,
    saveProduct,
  } = useProducts();

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const openAddModal = useCallback(() => {
    setEditingProduct(null);
    setShowModal(true);
  }, []);

  const openEditModal = useCallback((product: Product) => {
    setEditingProduct(product);
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setEditingProduct(null);
  }, []);

  const handleSubmit = useCallback(
    async (form: ProductFormData) => {
      try {
        await saveProduct(form, editingProduct);
        closeModal();
      } catch {
        // error surfaced via the hook's error state; keep modal open so the user can retry
      }
    },
    [saveProduct, editingProduct, closeModal],
  );

  return (
    <div className="products-page">
      <div className="products-page__page-header">
        <h2>Products</h2>
        <p className="products-page__page-subtitle">Manage your product inventory</p>
      </div>

      {error ? (
        <div className="products-page__error-banner" role="alert">
          {error}
        </div>
      ) : null}

      <ProductToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onAddClick={openAddModal}
      />

      {loading ? (
        <p className="products-page__loading">Loading products...</p>
      ) : (
        <ProductTable
          products={filteredProducts}
          onEdit={openEditModal}
          onDelete={deleteProduct}
        />
      )}

      {showModal && (
        <ProductFormModal
          editingProduct={editingProduct}
          onClose={closeModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}

export default Products;
