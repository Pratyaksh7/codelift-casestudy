import type { TopProduct } from '../types';
import { formatCurrency } from '../utils';

export type TopProductsTableProps = {
  products: TopProduct[];
};

export function TopProductsTable({ products }: TopProductsTableProps) {
  return (
    <div className="analytics-section">
      <h3 className="analytics-section-title">Top Products</h3>
      <table className="analytics-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Product Name</th>
            <th>Units Sold</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => {
            const rowKey = `${index}-${product.name}`;
            return (
              <tr key={rowKey}>
                <td className="analytics-table-index">{index + 1}</td>
                <td className="analytics-table-name">{product.name}</td>
                <td>{product.sales}</td>
                <td className="analytics-table-revenue">
                  {formatCurrency(product.revenue)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TopProductsTable;
