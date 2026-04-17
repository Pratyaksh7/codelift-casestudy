import type { Product } from '../../hooks/useProducts';
import './ProductTable.css';

export type ProductTableProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (productId: number) => void;
};

export function ProductTable({ products, onEdit, onDelete }: ProductTableProps) {
  return (
    <div className="products-page__table-wrap">
      <table className="products-page__table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={5} className="products-page__empty">
                No products found.
              </td>
            </tr>
          ) : (
            products.map((product) => {
              const isLow = product.stock < 10;
              return (
                <tr key={product.id}>
                  <td className="products-page__name-cell">{product.name}</td>
                  <td>
                    <span className="products-page__category-pill">
                      {product.category}
                    </span>
                  </td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <span
                      className={
                        isLow
                          ? 'products-page__stock products-page__stock--low'
                          : 'products-page__stock'
                      }
                    >
                      {product.stock}
                    </span>
                    {isLow && (
                      <span className="products-page__low-label">Low</span>
                    )}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="products-page__btn products-page__btn--primary products-page__btn--sm products-page__row-btn"
                      onClick={() => onEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="products-page__btn products-page__btn--danger products-page__btn--sm"
                      onClick={() => onDelete(product.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductTable;
