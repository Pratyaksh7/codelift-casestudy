import './ProductToolbar.css';

export type ProductToolbarProps = {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onAddClick: () => void;
};

export function ProductToolbar({
  searchTerm,
  onSearchChange,
  onAddClick,
}: ProductToolbarProps) {
  return (
    <div className="products-page__toolbar">
      <input
        type="text"
        className="products-page__search-input"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <button
        type="button"
        className="products-page__btn products-page__btn--primary"
        onClick={onAddClick}
      >
        + Add Product
      </button>
    </div>
  );
}

export default ProductToolbar;
